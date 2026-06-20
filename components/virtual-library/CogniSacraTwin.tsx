import React, { useState } from 'react';
import { Cpu, MessageSquare, Sparkles, TrendingUp, Compass, CheckCircle, HelpCircle, GraduationCap } from 'lucide-react';
import { sendMessageToAI } from '../../services/geminiService';

interface MasteryTrack {
  subject: string;
  level: number; // 0 to 100
  status: 'knows' | 'learning' | 'struggles';
  color: string;
}

export default function CogniSacraTwin() {
  const [twinInput, setTwinInput] = useState('');
  const [twinChatHistory, setTwinChatHistory] = useState<Array<{ sender: 'twin' | 'user'; text: string }>>([
    { sender: 'twin', text: "Hello Sarah. I've updated your Knowledge Twin profile based on your organic waste and bioenergy notes. We're showing a strong 92% alignment in circular economics, but high cognitive friction (42%) around thermodynamic transfer equations. What shall we optimize today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const [masteries, setMasteries] = useState<MasteryTrack[]>([
    { subject: 'Circular Economies & Recycling Loops', level: 92, status: 'knows', color: 'bg-emerald-500' },
    { subject: 'Sub-Saharan Infrastructure Economics', level: 78, status: 'learning', color: 'bg-indigo-600' },
    { subject: 'Applied Machine Learning Models', level: 65, status: 'learning', color: 'bg-blue-500' },
    { subject: 'Thermodynamics & Heat Transfer Kinetics', level: 42, status: 'struggles', color: 'bg-crimson' },
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twinInput.trim()) return;

    const userMsg = twinInput.trim();
    setTwinChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setTwinInput('');
    setIsTyping(true);

    const promptText = `You are Sarah Mwangi's customized CogniSacra Knowledge Twin AI. You know Sarah's academic strengths (Circular Economies: 92%, Infrastructure: 78%) and friction points (Thermodynamics: 42%). Answer this question keeping her academic targets, profile metrics, and career goals in mind: "${userMsg}"`;

    try {
      const responseStream = await sendMessageToAI(promptText);
      let cumulativeResponse = "";
      setTwinChatHistory(prev => [...prev, { sender: 'twin', text: "Synthesized insights..." }]);
      
      for await (const chunk of responseStream) {
        if (chunk.text) {
          cumulativeResponse += chunk.text;
          setTwinChatHistory(prev => {
            const next = [...prev];
            next[next.length - 1] = { sender: 'twin', text: cumulativeResponse };
            return next;
          });
        }
      }
    } catch (e) {
      console.warn("AI Twin generation failed, fallback applied:", e);
      setTimeout(() => {
        setTwinChatHistory(prev => [...prev, { 
          sender: 'twin', 
          text: `Based on your query, I suggest we dive deeper into the bio-chemical kinetics of organic bio-converters. I've scheduled a customized 15-minute concept review in your calendar on heat absorption thresholds to boost your Thermodynamics mastery closer to 55%.` 
        }]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-905 rounded-3xl p-6 border border-slate-205 dark:border-slate-800 shadow-sm">
      
      {/* Header section with brand accent */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b pb-4">
        <div>
          <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-black uppercase px-2.5 py-1 rounded-full border border-rose-100 dark:border-rose-900/60">
            CogniSacra™ Advanced Signature Infrastructure
          </span>
          <h2 className="text-xl font-bold font-serif text-slate-850 dark:text-white mt-1.5 flex items-center gap-2">
            <Cpu className="text-crimson animate-pulse" size={20} />
            <span>CogniSacra Knowledge Twin™</span>
          </h2>
          <p className="text-xs text-slate-404">A portable, personal academic companion that models what you know, how you learn, and forecasts future study tracks.</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold bg-white dark:bg-slate-855 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl">
          <GraduationCap size={15} />
          <span>Active Cognitive Twin ID: SAC-88241</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Cognitive Mastery Tracker & Subject confidence bars */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-950 border border-slate-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5 pb-2 border-b">
              <TrendingUp size={12} className="text-crimson" />
              <span>Cognitive State Profiler</span>
            </h3>

            <div className="space-y-4 mt-4">
              {masteries.map((m, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{m.subject}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      m.status === 'knows' ? 'bg-emerald-50 text-emerald-600' : m.status === 'learning' ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-crimson'
                    }`}>
                      {m.status === 'knows' ? `Mastered • ${m.level}%` : m.status === 'learning' ? `Learning • ${m.level}%` : `Review Needed • ${m.level}%`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full transition-all duration-1000`} style={{ width: `${m.level}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* AI predictive pathway panel */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 space-y-2.5 text-[11px]">
              <h4 className="font-extrabold uppercase tracking-widest text-[9.5px] text-slate-404 flex items-center gap-1">
                <Compass size={11} className="text-indigo-500" />
                <span>AI Predictive Study Path</span>
              </h4>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-3.5 rounded-xl space-y-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-black text-slate-800 dark:text-slate-200">Recommendation 1: Thermodynamic Sandbox</span>
                    <p className="text-slate-404 text-[10px] leading-relaxed mt-0.5">Spend 15 minutes today on Pendulum oscillator systems under high-gravity conditions to solidify potential energy friction mathematics.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-850">
                  <CheckCircle size={13} className="text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-slate-800 dark:text-slate-200">Recommendation 2: Research Gap Identification</span>
                    <p className="text-slate-404 text-[10px] leading-relaxed mt-0.5 font-sans">Prompt the Research Desk on "Industrial waste networks in East Africa" to map your circular thesis parameters.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-red-10 px-3.5 border border-red-50 text-[10px] leading-loose text-slate-404 mt-6 text-center italic rounded-xl">
            💡 The CogniSacra Passport aggregates these masteries for portable university applications.
          </div>
        </div>

        {/* RIGHT COLUMN: The Interactive Twin chatbot */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5 pb-2.5 border-b">
              <MessageSquare size={12} className="text-indigo-500" />
              <span>Converse with Knowledge Twin</span>
            </h3>

            {/* Chat screen lists */}
            <div className="space-y-4 max-h-56 overflow-y-auto mt-4 pr-1 text-xs">
              {twinChatHistory.map((item, idx) => (
                <div key={idx} className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 mb-0.5">
                    {item.sender === 'user' ? 'Sarah Mwangi' : 'CogniSacra Twin'}
                  </span>
                  <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    item.sender === 'user' 
                      ? 'bg-crimson text-white rounded-tr-none' 
                      : 'bg-slate-50 dark:bg-slate-805 text-slate-650 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-750'
                  }`}>
                    {item.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-extrabold pb-2">
                  <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span>Computing profile matrices...</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl mt-6 border border-slate-100 dark:border-slate-850">
            <input
              type="text"
              placeholder="e.g. Optimize my studies in Thermodynamics..."
              value={twinInput}
              onChange={(e) => setTwinInput(e.target.value)}
              disabled={isTyping}
              className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-transparent border-none text-slate-800 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={isTyping}
              className="bg-crimson hover:bg-crimson/95 text-white font-extrabold text-xs px-4 py-1.5 rounded-lg transition shrink-0"
            >
              Consult
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
