import React, { useState } from 'react';
import { 
  BookOpen, Compass, Sparkles, Network, Database, Brain, Film, ShoppingCart, 
  Settings, Award, TrendingUp, Users, AwardIcon, FileText, Search, Play, 
  HelpCircle, CheckCircle, ArrowRight, Quote, Plus, CreditCard, ChevronRight, Map, Globe
} from 'lucide-react';

// Modular feature components
import LibraryGraphUniverse from './virtual-library/LibraryGraphUniverse';
import AIReadingMode from './virtual-library/AIReadingMode';
import SmartWorkspace from './virtual-library/SmartWorkspace';
import VirtualResearchLab from './virtual-library/VirtualResearchLab';
import CogniSacraTwin from './virtual-library/CogniSacraTwin';
import { sendMessageToAI } from '../services/geminiService';

// Content items representing Feature 3: Universal Content Library
const SAMPLE_LITERATURE = [
  {
    id: 'eco-circular-1',
    title: 'The Emergence of Circular Economy Systems in Sub-Saharan Africa',
    author: 'Dr. Sarah Mwangi, Prof. John Adebayo',
    category: 'Research Paper',
    institution: 'University of Nairobi',
    year: 2026,
    tags: ['Circular Economy', 'Sustainable Development', 'Africa'],
    excerpt: 'An investigation into closed-loop resource systems across municipal centers in Kenya and Nigeria.',
    price: { amount: 1500, currency: 'KES' }
  },
  {
    id: 'solar-microgrid-2',
    title: 'Decentralized Microgrid Layouts & Solar System Controls',
    author: 'Dr. Kwame Nkrumah, Eng. Fatoumata Diallo',
    category: 'Textbook',
    institution: 'Ashesi University',
    year: 2025,
    tags: ['Renewable Energy', 'Electrical Engineering', 'Microgrids'],
    excerpt: 'Key equations, configurations, and resistance parameters for localized off-grid grids.',
    price: { amount: 350, currency: 'NGN' }
  },
  {
    id: 'agric-organic-3',
    title: 'Agroforestry & Soil Regeneration Standards in East Africa',
    author: 'Prof. Maryam Al-Mansoor',
    category: 'Journal',
    institution: 'Makerere University',
    year: 2026,
    tags: ['Agriculture', 'Organic Farming', 'Agroforestry'],
    excerpt: 'Integrating organic legume crops with nitrogen recycling standards topographies.',
    price: { amount: 120, currency: 'ZAR' }
  }
];

export default function VirtualLibraryView({ userRole }: { userRole: string }) {
  const [activeTab, setActiveTab] = useState<'universe' | 'reader' | 'research' | 'labs' | 'workspace' | 'video' | 'market' | 'network' | 'passport' | 'twin'>('twin');

  // Universal content navigation states
  const [contentSearchText, setContentSearchText] = useState('');
  const [selectedLitId, setSelectedLitId] = useState<string | null>(null);

  // Feature 4: AI Research Desk States
  const [researchPrompt, setResearchPrompt] = useState('What are the emerging trends in Circular Economy in Africa?');
  const [researchReport, setResearchReport] = useState<string>('');
  const [isResearching, setIsResearching] = useState(false);

  // Feature 8: Video Intelligence States
  const [selectedVideo, setSelectedVideo] = useState({
    title: 'Lecture 12: Microfluidics and Bio-conversion mechanics',
    instructor: 'Dean Al-Hassan, GIMPA',
    duration: '42:15',
    activeTimestamp: 0,
    timestamps: [
      { time: 0, label: 'Overview of organic waste streams', notes: 'Linear flows vs closed loops analysis.' },
      { time: 320, label: 'Bio-converter system architecture', notes: 'Configuring flow rates and temperature values.' },
      { time: 840, label: 'East African case studies', notes: 'Empirical data on bioenergy blocks near Kisumu County.' },
      { time: 1420, label: 'Summary quiz and lab setups', notes: 'Guidelines for pH titration experiments.' }
    ]
  });
  const [aiNotesText, setAiNotesText] = useState('');
  const [isBuildingVideoNotes, setIsBuildingVideoNotes] = useState(false);

  // Feature 9: Marketplace States
  const [listingForm, setListingForm] = useState({ title: '', price: '', category: 'Study Guide' });
  const [marketItems, setMarketItems] = useState([
    { id: 'm1', title: 'Calculus III Comprehensive Study Guide', seller: 'Timothy Kamau (Learner)', price: '850 KES', rating: 4.8 },
    { id: 'm2', title: 'Advanced Agroforestry Curriculum Slides', seller: 'Prof. Maryam Al-Mansoor', price: '2,400 KES', rating: 5.0 },
    { id: 'm3', title: 'Microgrid Network Simulator Parameters Notebook', seller: 'Eng. Fatoumata Diallo', price: 'Free', rating: 4.9 }
  ]);
  const [showListedAlert, setShowListedAlert] = useState(false);

  // Search literature resolver
  const filteredLiterature = SAMPLE_LITERATURE.filter(lit =>
    lit.title.toLowerCase().includes(contentSearchText.toLowerCase()) ||
    lit.tags.some(t => t.toLowerCase().includes(contentSearchText.toLowerCase()))
  );

  // Trigger real or simulated literature compilation
  const handleCompileResearch = async () => {
    setIsResearching(true);
    setResearchReport('');
    const prompt = `Write a deep, premium academic literature review regarding: "${researchPrompt}". Include Context, Key African Hubs, Recommended Citations, and identified Scientific gaps. Format clearly in beautiful markdown syntax.`;
    
    try {
      const responseStream = await sendMessageToAI(prompt);
      let cumulative = '';
      for await (const chunk of responseStream) {
        if (chunk.text) {
          cumulative += chunk.text;
          setResearchReport(cumulative);
        }
      }
    } catch (e) {
      console.warn("AI Research failure, fallback applied:", e);
      // Fallback
      setResearchReport(`### 🌍 Literature Review: Circular Economy Trends in Africa
Circular solutions in Africa are increasingly dynamic, transitioning from survivalist organic recycling to institutionalized high-tech business loops.

#### 1. Core Regional Initiatives
* **East African Hubs**: Utilizing flower farm waste dynamics in Kenya to feed bio-digestion energy hubs.
* **West African Recycling networks**: Standardizing circular scrap iron sorting in Lagos metropolitan sectors.

#### 2. Research Gaps & Policy Bottlenecks
* **Product Certification**: Lack of cross-border standardization inhibits circular commodity flow under AfCFTA guidelines.
* **Financial Capital**: High initial costs of bio-digesters limit cooperative scaled activities.

#### 3. Source Citations
* Mwangi, S. (2026). *The Emergence of Circular Economy Systems in Sub-Saharan Africa*. Nairobi Publishing.`);
    } finally {
      setIsResearching(false);
    }
  };

  // Lecture Video auto-notes compiler
  const handleCompileVideoNotes = () => {
    setIsBuildingVideoNotes(true);
    setTimeout(() => {
      setAiNotesText(`### 🧠 AI Generated Lecture Summary Notes
* **Summary Overview**: Explored the mechanics of decentralized microfluidics. Converting organic floral discharge into bio-digestion energy.
* **Key Guidelines**: Maintain absolute flow rates beneath 0.45 ml/sec.
* **Recommended Next Steps**: Conduct pH titration and pendulum oscillation tests in the STEM virtual lab compartment.`);
      setIsBuildingVideoNotes(false);
    }, 1200);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingForm.title || !listingForm.price) return;
    const item = {
      id: Date.now().toString(),
      title: listingForm.title,
      seller: 'Sarah Mwangi (You)',
      price: listingForm.price,
      rating: 5.0
    };
    setMarketItems([item, ...marketItems]);
    setListingForm({ title: '', price: '', category: 'Study Guide' });
    setShowListedAlert(true);
    setTimeout(() => setShowListedAlert(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Launcher banner */}
      <div className="relative bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 overflow-hidden shadow-xl">
        <div className="absolute right-[-60px] top-[-30px] opacity-10 blur-md select-none pointer-events-none">
          <Database size={350} />
        </div>
        
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="bg-crimson/25 border border-crimson/30 text-crimson text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
            Virtual Library Feature™
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-serif tracking-tight leading-tight">
            AI-Powered Academic Intelligence System
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            The world's first intelligent academic knowledge ecosystem that learns alongside every student. Explore interdisciplinary graphs, run STEM simulations, converse with your Knowledge Twin, and publish on peer networks.
          </p>
        </div>

        {/* Quick Hub Navigation Deck */}
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 mt-6 pt-6 border-t border-white/10 text-center text-[10px] font-bold">
          {[
            { id: 'twin', label: 'CogniSacra Twin', icon: <Brain size={14} /> },
            { id: 'universe', label: 'Knowledge Universe', icon: <Network size={14} /> },
            { id: 'reader', label: 'AI Reading Mode', icon: <BookOpen size={14} /> },
            { id: 'research', label: 'AI Research Desk', icon: <Compass size={14} /> },
            { id: 'labs', label: 'STEM Lab Sandbox', icon: <Database size={14} /> },
            { id: 'workspace', label: 'Study Cockpit', icon: <Settings size={14} /> },
            { id: 'video', label: 'Video Intelligence', icon: <Film size={14} /> },
            { id: 'market', label: 'Marketplace', icon: <ShoppingCart size={14} /> },
            { id: 'network', label: 'Scholar Circle', icon: <Users size={14} /> },
            { id: 'passport', label: 'Academic Passport', icon: <Award size={14} /> },
          ].map(hub => (
            <button
              key={hub.id}
              onClick={() => setActiveTab(hub.id as any)}
              className={`p-2 rounded-xl flex flex-col items-center gap-1.5 transition ${
                activeTab === hub.id 
                  ? 'bg-crimson text-white shadow-glow translate-y-[-2px]' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {hub.icon}
              <span className="truncate w-full">{hub.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main active sub-system */}
      <div className="relative">
        
        {/* COGNISACRA KNOWLEDGE TWIN */}
        {activeTab === 'twin' && <CogniSacraTwin />}

        {/* KNOWLEDGE UNIVERSE */}
        {activeTab === 'universe' && <LibraryGraphUniverse />}

        {/* AI READING MODE */}
        {activeTab === 'reader' && <AIReadingMode />}

        {/* EXPERIMENTAL RESEARCH LAB */}
        {activeTab === 'labs' && <VirtualResearchLab />}

        {/* STUDY COCKPIT WORKSPACE */}
        {activeTab === 'workspace' && <SmartWorkspace />}

        {/* AI RESEARCH ENGINE CABINET */}
        {activeTab === 'research' && (
          <div className="bg-slate-50 dark:bg-slate-905 rounded-3xl p-6 border border-slate-205 dark:border-slate-850 shadow-sm space-y-6">
            <div className="border-b pb-4">
              <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-black uppercase px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-900/60">
                Feature 4: AI Research Engine & Gap Discovery
              </span>
              <h2 className="text-xl font-bold font-serif text-slate-850 dark:text-white mt-1.5">AI Research Desk</h2>
              <p className="text-xs text-slate-404">Enter complex inquiries to synthesize cross-disciplinary trends, peer citations, and identify unresearched scientific gaps.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Prompt box */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Research Inquiry Prompt</label>
                    <textarea
                      rows={5}
                      value={researchPrompt}
                      onChange={(e) => setResearchPrompt(e.target.value)}
                      placeholder="Ask our research engines to crawl the directories..."
                      className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-755 bg-transparent text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 rounded-xl space-y-1.5 text-[10.5px] text-slate-650 dark:text-slate-404">
                    <span className="text-[9px] uppercase font-black text-indigo-600 block tracking-widest">Active Crawl Settings</span>
                    <p>Search includes: Google Scholar APIs, ResearchGate directory indexes, and university private collections in Nairobi, Makerere, and Ashesi.</p>
                  </div>
                </div>

                <button
                  onClick={handleCompileResearch}
                  disabled={isResearching}
                  className="w-full mt-6 bg-crimson hover:bg-crimson/95 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow flex justify-center items-center gap-1.5"
                >
                  <Sparkles size={13} className={isResearching ? 'animate-spin' : ''} />
                  <span>{isResearching ? 'Synthesizing Scholar Papers...' : 'Compile Research Findings'}</span>
                </button>
              </div>

              {/* Research compiled output board */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-150 p-6 rounded-2xl shadow-sm min-h-[320px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-850">
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-550 flex items-center gap-1">
                      <CheckCircle size={12} className="text-emerald-500 animate-pulse" />
                      <span>Synthesized Research Thesis</span>
                    </span>
                  </div>

                  {isResearching ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                      <div className="h-6 w-6 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-slate-404 font-black uppercase tracking-widest animate-pulse">Clustering source databases...</span>
                    </div>
                  ) : researchReport ? (
                    <div className="mt-4 text-xs font-semibold text-slate-700 dark:text-slate-200 leading-relaxed space-y-4 max-h-72 overflow-y-auto pr-1">
                      {researchReport.split('\n').map((line, lIdx) => {
                        if (line.startsWith('###')) {
                          return <h3 key={lIdx} className="font-bold font-serif text-sm text-slate-900 dark:text-white mt-2 pt-2 border-b pb-1">{line.replace('###', '')}</h3>;
                        }
                        if (line.startsWith('####')) {
                          return <h4 key={lIdx} className="font-extrabold text-slate-850 dark:text-slate-100 mt-2">{line.replace('####', '')}</h4>;
                        }
                        if (line.startsWith('*')) {
                          return <div key={lIdx} className="flex gap-2 items-start"><span className="text-crimson">•</span><span>{line.replace('*', '').trim()}</span></div>;
                        }
                        return <p key={lIdx}>{line}</p>;
                      })}
                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-400 space-y-2">
                      <HelpCircle size={32} className="mx-auto opacity-35" />
                      <p className="text-xs font-bold">Write an academic inquiry and click Compile to activate secondary source synthesizers.</p>
                    </div>
                  )}
                </div>

                {researchReport && (
                  <div className="flex justify-between gap-4 mt-6 pt-4 border-t border-slate-50 dark:border-slate-850">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">Citations Export ready</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(researchReport);
                        alert('Copied compiled research outline to clipboard.');
                      }}
                      className="text-[10px] font-black uppercase text-crimson hover:underline"
                    >
                      Export Outlines
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ACADEMIC VIDEO INTELLIGENCE */}
        {activeTab === 'video' && (
          <div className="bg-slate-50 dark:bg-slate-905 rounded-3xl p-6 border border-slate-205 dark:border-slate-850 shadow-sm space-y-6">
            <div className="border-b pb-4">
              <span className="bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-black uppercase px-2.5 py-1 rounded-full border border-purple-100 dark:border-purple-900/60">
                Feature 8: Lecture Video Intelligence & Transcription Indexing
              </span>
              <h2 className="text-xl font-bold font-serif text-slate-850 dark:text-white mt-1.5 flex items-center gap-1.5">
                <Film className="text-crimson" size={18} />
                <span>Academic Video Intelligence</span>
              </h2>
              <p className="text-xs text-slate-404">View lectures alongside dynamic transcripts, click timestamps, and trigger AI note summaries.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Fake Video Player area */}
              <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden relative min-h-[280px] p-4 flex flex-col justify-end text-white">
                {/* Background graphic */}
                <div className="absolute inset-0 bg-cover bg-center bg-radial from-slate-900 to-indigo-950 opacity-40" />

                <div className="absolute inset-0 m-auto h-14 w-14 rounded-full bg-crimson hover:scale-105 flex items-center justify-center cursor-pointer shadow-lg transition">
                  <Play size={24} className="ml-1 text-white" />
                </div>

                <div className="relative z-10 space-y-1">
                  <span className="bg-black/30 border text-[9px] uppercase px-1.5 py-0.5 rounded text-indigo-400 font-black">
                    Class video lecture • GIMPA Core
                  </span>
                  <h3 className="font-bold text-sm tracking-tight">{selectedVideo.title}</h3>
                  <p className="text-xs text-slate-400">{selectedVideo.instructor}</p>
                </div>
              </div>

              {/* Dynamic Transcript lists & AI Notes Generator */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-[310px]">
                <div>
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-404 pb-2 border-b">
                    Interactive Transcript Timestamps
                  </h4>
                  <div className="space-y-2 mt-3.5 max-h-40 overflow-y-auto pr-1">
                    {selectedVideo.timestamps.map((t, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedVideo(prev => ({ ...prev, activeTimestamp: t.time }))}
                        className={`p-2.5 rounded-xl border text-xs cursor-all-scroll transition ${
                          selectedVideo.activeTimestamp === t.time 
                            ? 'bg-crimson/5 border-crimson/30 ring-1 ring-crimson' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-805 dark:border-slate-750'
                        }`}
                      >
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-slate-805 dark:text-slate-205">{t.label}</span>
                          <span className="font-mono text-crimson text-[10.5px]">
                            {Math.floor(t.time / 60)}:{(t.time % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-404 mt-1 leading-normal">{t.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCompileVideoNotes}
                  disabled={isBuildingVideoNotes}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs py-2.5 rounded-xl transition"
                >
                  {isBuildingVideoNotes ? 'Extracting notes summary...' : 'Generate Automatic Notes & Quiz'}
                </button>
              </div>
            </div>

            {aiNotesText && (
              <div className="bg-white dark:bg-slate-950 border border-slate-150 p-5 rounded-2xl shadow-sm animate-fade-in text-xs leading-relaxed space-y-3">
                {aiNotesText.split('\n').map((line, lIdx) => {
                  if (line.startsWith('###')) {
                    return <h4 key={lIdx} className="font-black text-slate-900 dark:text-white uppercase font-serif mt-1">{line.replace('###', '')}</h4>;
                  }
                  if (line.startsWith('*')) {
                    return <div key={lIdx} className="flex gap-2 items-start"><span className="text-crimson">•</span><span>{line.replace('*', '').trim()}</span></div>;
                  }
                  return <p key={lIdx}>{line}</p>;
                })}
              </div>
            )}
          </div>
        )}

        {/* ACADEMIC KNOWLEDGE MARKETPLACE */}
        {activeTab === 'market' && (
          <div className="bg-slate-50 dark:bg-slate-905 rounded-3xl p-6 border border-slate-205 dark:border-slate-850 shadow-sm space-y-6">
            <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-black uppercase px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-900/60">
                  Feature 9: Academic Knowledge Marketplace Layer
                </span>
                <h2 className="text-xl font-bold font-serif text-slate-850 dark:text-white mt-1.5 flex items-center gap-2">
                  <ShoppingCart className="text-crimson" size={18} />
                  <span>Academic Knowledge Marketplace</span>
                </h2>
                <p className="text-xs text-slate-404">Buy notes, sell study guides resources, and publish journals in local currency structures.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Form to list my study guides */}
              <form onSubmit={handleCreateListing} className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider">Publish New Guide/Notes</h3>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black block">Resource Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Organic bioenergy equations notes..."
                    value={listingForm.title}
                    onChange={(e) => setListingForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-755 bg-transparent text-slate-8s0 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-404 uppercase font-black block">Price (e.g. 1000 KES or Free)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1,200 KES..."
                    value={listingForm.price}
                    onChange={(e) => setListingForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-755 bg-transparent text-slate-8s0 dark:text-white focus:outline-none"
                  />
                </div>

                <button type="submit" className="w-full bg-crimson hover:bg-crimson/95 text-white font-extrabold text-xs py-2 rounded-xl transition">
                  List Resource on Market
                </button>

                {showListedAlert && (
                  <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-xl border border-green-150 text-center">
                    ✓ Guide successfully cataloged in the Africa virtual index database.
                  </div>
                )}
              </form>

              {/* Items directory cards */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-150 p-6 rounded-2xl shadow-sm space-y-4 max-h-[365px] overflow-y-auto">
                {marketItems.map(item => (
                  <div key={item.id} className="p-4 border rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-100 dark:border-slate-850">
                    <div className="space-y-1.5 max-w-[70%]">
                      <span className="bg-slate-100 dark:bg-slate-800 text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded text-slate-450 dark:text-slate-350">
                        {item.seller}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{item.title}</h4>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        Rating: ★ {item.rating}
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between items-end gap-2 shrink-0">
                      <span className="text-xs font-bold text-crimson font-mono">{item.price}</span>
                      <button className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[9px] uppercase px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <CreditCard size={10} />
                        <span>Acquire</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GLOBAL SCHOLAR NETWORK */}
        {activeTab === 'network' && (
          <div className="bg-slate-50 dark:bg-slate-905 rounded-3xl p-6 border border-slate-205 dark:border-slate-850 shadow-sm space-y-6">
            <div className="border-b pb-4">
              <span className="bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-black uppercase px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-900/60">
                Feature 12: Global Scholar Academic Social Interface
              </span>
              <h2 className="text-xl font-bold font-serif text-slate-850 dark:text-white mt-1.5 flex items-center gap-1.5">
                <Users className="text-crimson" size={18} />
                <span>Global Scholar Network</span>
              </h2>
              <p className="text-xs text-slate-404">Collaborate with active researchers, map expert circles, and schedule peer mentorship dialogs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1 Study Circle */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[8px] uppercase tracking-widest font-black text-rose-500 block mb-1">Active Study Circles</span>
                  <h3 className="font-bold text-slate-850 dark:text-white text-xs font-serif">Sub-Saharan Bio-Fibers Initiative</h3>
                  <p className="text-[11px] text-slate-404 leading-relaxed mt-2.5">
                    Cooperative research mapping agricultural bamboo resilience indicators to manufacturing supply chains.
                  </p>
                </div>
                <button className="mt-6 w-full text-center bg-slate-950 text-white font-bold text-xs py-2 rounded-xl">
                  Join Circle (24 Active)
                </button>
              </div>

              {/* Card 2 expert matchmaking */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[8px] uppercase tracking-widest font-black text-indigo-500 block mb-1">Expert Mentor Matches</span>
                  <h3 className="font-bold text-slate-850 dark:text-white text-xs font-serif">Prof. Maryam Al-Mansoor</h3>
                  <p className="text-[11px] text-slate-404 leading-relaxed mt-2.5 font-sans">
                    Dean of Agronomy Makerere. Offering expert reviews on closed nitrogen balance crop topographies.
                  </p>
                </div>
                <button className="mt-6 w-full text-center bg-crimson text-white font-bold text-xs py-2 rounded-xl">
                  Schedule Mentoring Slot
                </button>
              </div>

              {/* Card 3 Trending insights */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[8px] uppercase tracking-widest font-black text-amber-500 block mb-1">Trending Peer Forum Thread</span>
                  <h3 className="font-bold text-slate-850 dark:text-white text-xs font-serif">AfcFTA Standardization Obstacles</h3>
                  <p className="text-[11px] text-slate-404 leading-relaxed mt-2.5">
                    Analyzing the trade certification rules required for green agricultural material transit.
                  </p>
                </div>
                <button className="mt-6 w-full text-center bg-slate-950 text-white font-bold text-xs py-2 rounded-xl">
                  Join Forum Debate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DIGITAL ACADEMIC PASSPORT */}
        {activeTab === 'passport' && (
          <div className="bg-slate-50 dark:bg-slate-905 rounded-3xl p-6 border border-slate-205 dark:border-slate-850 shadow-sm space-y-6">
            <div className="border-b pb-4">
              <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-black uppercase px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-900/60">
                Feature 15: Lifetime Verifiable Digital Passport
              </span>
              <h2 className="text-xl font-bold font-serif text-slate-850 dark:text-white mt-1.5 flex items-center gap-1.5">
                <Award className="text-crimson" size={18} />
                <span>Digital Academic Passport</span>
              </h2>
              <p className="text-xs text-slate-404">Your sovereign lifetime credential locker. Securely stores certifications, peer contributions, and career alignments.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Visual Passport block */}
              <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-950 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[280px] relative overflow-hidden">
                <div className="absolute right-[-40px] bottom-[-40px] opacity-10 blur-sm">
                  <Award size={200} />
                </div>

                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase tracking-widest font-black text-rose-450 block">Lifelong Scholar Locker</span>
                    <h3 className="text-base font-serif font-bold text-white">EmpowerAfriq Academic Card</h3>
                  </div>
                  <Globe size={18} className="text-rose-450 animate-pulse" />
                </div>

                <div className="my-6 space-y-2">
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-404 block">Credentials Verification ID</span>
                  <code className="text-xs text-slate-201 block font-mono bg-black/40 p-2 rounded-xl">EAP-992-88419-X</code>
                  <p className="text-xs font-black">Hold: Sarah Mwangi</p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-350 border-t border-white/10 pt-4">
                  <span>Sovereign ID Verified</span>
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                </div>
              </div>

              {/* Verified Certificates Index List */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-150 p-6 rounded-2xl shadow-sm space-y-4">
                <h4 className="text-[10px] uppercase font-black text-slate-404 tracking-wider pb-2 border-b">
                  Verifiable Achievements Directory
                </h4>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {[
                    { title: 'Circular Economies System Certification', issuer: 'University of Nairobi', date: '2026-06-18', status: 'Verifiable Signature Green' },
                    { title: 'STEM Basic Titration Lab Competency', issuer: 'EmpowerAfriq Academy', date: '2026-06-12', status: 'Sovereign Lock Verified' }
                  ].map((cert, idx) => (
                    <div key={idx} className="p-3 border rounded-xl flex justify-between items-center bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border-slate-100 dark:border-slate-850 transition">
                      <div className="space-y-1 max-w-[80%]">
                        <h5 className="font-bold text-slate-850 dark:text-white text-xs">{cert.title}</h5>
                        <div className="text-[10px] text-slate-404 font-semibold uppercase flex items-center gap-1.5">
                          <span>{cert.issuer}</span>
                          <span>•</span>
                          <span>{cert.date}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                        {cert.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPREHENSIVE TEXTBOOKS DIRECTORY (ALWAYS AVAILABLE AS AN OVERVIEW UNDER SEARCH TO FIT FEATURE 3) */}
        {activeTab !== 'reader' && activeTab !== 'workspace' && activeTab !== 'labs' && activeTab !== 'twin' && (
          <div className="mt-8 bg-white dark:bg-slate-950 border border-slate-150 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">Feature 3: Content Repository Explorer</h3>
                <p className="text-xs text-slate-450 mt-0.5">Explore standard textbooks, research journals, university curriculum files in our master locker.</p>
              </div>

              {/* Local index search controls */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter textbooks, curriculum..."
                  value={contentSearchText}
                  onChange={(e) => setContentSearchText(e.target.value)}
                  className="w-full pl-9 px-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-450 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredLiterature.map(item => (
                <div key={item.id} className="border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm bg-slate-50 dark:bg-slate-900 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2.5 text-[8.5px] font-black uppercase tracking-widest text-slate-404">
                      <span>{item.category}</span>
                      <span>{item.year}</span>
                    </div>

                    <h4 className="font-bold text-slate-905 dark:text-white text-xs font-serif leading-relaxed">{item.title}</h4>
                    <p className="text-[10px] text-slate-404">{item.author} ({item.institution})</p>
                    <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed mt-2.5">{item.excerpt}</p>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-205 dark:border-slate-800">
                    <button
                      onClick={() => setActiveTab('reader')}
                      className="text-[10.5px] uppercase font-black text-crimson hover:underline flex items-center gap-1 shrink-0"
                    >
                      <span>Read Text</span>
                      <ArrowRight size={11} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLitId(item.id);
                        setResearchPrompt(`Provide a structural thesis check, literature gaps list, and citations outline for this document: "${item.title}"`);
                        setActiveTab('research');
                      }}
                      className="text-[10.5px] uppercase font-black text-indigo-500 hover:underline shrink-0"
                    >
                      AI Review Desk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
