import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, Mic, CheckSquare, Plus, Network, ListTodo, HelpCircle, Palette, Check } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  date: string;
  body: string;
}

interface MindNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface KanbanCard {
  id: string;
  title: string;
  column: 'todo' | 'progress' | 'done';
}

export default function SmartWorkspace() {
  const [activeTab, setActiveTab] = useState<'notes' | 'mindmap' | 'canvas' | 'kanban'>('notes');

  // Notes state
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Circular Manufacturing Kenya', date: '2026-06-18', body: 'Exploring use of biological waste fibers in structural insulation boards around Kisumu County.' },
    { id: '2', title: 'Solar Sandbox Parameters', date: '2026-06-19', body: 'Voltage settings for high load hours: set standard resistance at 0.45 ohm, target peak current 12A.' }
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteBody, setNewNoteBody] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [waveForms, setWaveForms] = useState<number[]>([]);

  // Canvas State & Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#e11d48');
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  // Mindmap State
  const [mindNodes, setMindNodes] = useState<MindNode[]>([
    { id: '1', label: 'My Research Topic', x: 200, y: 150, color: '#e11d48' },
    { id: '2', label: 'Literature Gaps', x: 60, y: 70, color: '#4f46e5' },
    { id: '3', label: 'Methodology Study', x: 340, y: 70, color: '#059669' },
    { id: '4', label: 'Pan-African Datasets', x: 60, y: 230, color: '#d97706' },
    { id: '5', label: 'Simulation Tests', x: 340, y: 230, color: '#7c3aed' },
  ]);

  // Kanban State
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>([
    { id: '1', title: 'Review circular economy certifications with supervisor', column: 'todo' },
    { id: '2', title: 'Run Chemistry Titration lab trials and report pH curves', column: 'progress' },
    { id: '3', title: 'Complete digital passport verification steps', column: 'done' }
  ]);
  const [newKanbanText, setNewKanbanText] = useState('');

  // Voice Recording Simulator
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveForms(Array.from({ length: 15 }, () => Math.floor(Math.random() * 24) + 4));
      }, 100);
    } else {
      setWaveForms([]);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      // Simulate speech-to-text output appending to our body
      setNewNoteBody(prev => prev ? prev + " [Voice Note Added: Reviewing sustainable structures with local authorities]" : "Reviewing sustainable structures with local authorities");
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    const item: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      date: new Date().toISOString().split('T')[0],
      body: newNoteBody
    };
    setNotes([item, ...notes]);
    setNewNoteTitle('');
    setNewNoteBody('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // Drawing Canvas logic
  useEffect(() => {
    if (activeTab === 'canvas' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
      }
    }
  }, [activeTab, brushColor, brushSize]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = isEraser ? '#ffffff' : brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Generate dynamic mind map node branch links
  const handleRegenerateMindmap = () => {
    // Generates a randomized layout of 5 distinct concepts branching out
    const topics = [
      "African Grid Integration", "Solar Cell Optimizers", "Thermal Energy Dissipation",
      "Socio-Economic Impacts", "Regulatory Approvals", "Microgrid Networks"
    ];
    const randomizedNodes = [
      { id: '1', label: 'Solar Sandbox Target', x: 200, y: 150, color: '#e11d48' },
      ...topics.map((t, idx) => {
        const radius = 110;
        const angle = (idx * 2 * Math.PI) / topics.length;
        return {
          id: (idx + 2).toString(),
          label: t,
          x: Math.round(200 + radius * Math.cos(angle)),
          y: Math.round(150 + radius * Math.sin(angle)),
          color: ['#4f46e5', '#059669', '#d97706', '#7c3aed', '#06b6d4', '#ec4899'][idx % 6]
        };
      })
    ];
    setMindNodes(randomizedNodes);
  };

  // Kanban controls
  const handleAddKanbanCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKanbanText.trim()) return;
    const card: KanbanCard = {
      id: Date.now().toString(),
      title: newKanbanText.trim(),
      column: 'todo'
    };
    setKanbanCards([...kanbanCards, card]);
    setNewKanbanText('');
  };

  const moveKanbanCard = (id: string, targetCol: 'todo' | 'progress' | 'done') => {
    setKanbanCards(kanbanCards.map(c => c.id === id ? { ...c, column: targetCol } : c));
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-905 rounded-3xl p-6 border border-slate-205 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b pb-4">
        <div>
          <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-black uppercase px-2.5 py-1 rounded-full border border-rose-100 dark:border-rose-900/60">
            Feature 5: Secure Notebook, Slate Canvas & Study Boards
          </span>
          <h2 className="text-xl font-bold font-serif text-slate-850 dark:text-white mt-1.5">Smart Study Workspace</h2>
          <p className="text-xs text-slate-404">A integrated private deck to manage homework, audio diaries, mindmaps, and kanban cards.</p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-white dark:bg-slate-850 border border-slate-150 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'notes' ? 'bg-crimson text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800'
            }`}
          >
            <Pencil size={11} />
            <span>Diary Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('mindmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'mindmap' ? 'bg-crimson text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800'
            }`}
          >
            <Network size={11} />
            <span>Mind Maps</span>
          </button>
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'canvas' ? 'bg-crimson text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800'
            }`}
          >
            <Palette size={11} />
            <span>Doodle Sandbox</span>
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'kanban' ? 'bg-crimson text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800'
            }`}
          >
            <ListTodo size={11} />
            <span>Kanban Boards</span>
          </button>
        </div>
      </div>

      <div className="min-h-[380px]">
        {/* TAB 1: Notebook & Voice logs */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleAddNote} className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider">Write or Speak Study Note</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black block">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Bioenergy structures project..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-755 bg-transparent text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black block">Note Details</label>
                  
                  {/* Speech Recorder */}
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase transition ${
                      isRecording 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Mic size={10} />
                    <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
                  </button>
                </div>

                {isRecording && (
                  <div className="flex items-end justify-center gap-0.5 h-6 bg-slate-50 dark:bg-slate-950 px-3 rounded-lg border border-dashed border-red-200 py-1.5">
                    {waveForms.map((val, idx) => (
                      <span key={idx} className="w-1 bg-red-500 rounded-full transition-all" style={{ height: `${val}px` }} />
                    ))}
                  </div>
                )}

                <textarea
                  placeholder="Draft your detailed formulas, summary notes, or bibliography links here..."
                  rows={4}
                  value={newNoteBody}
                  onChange={(e) => setNewNoteBody(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-755 bg-transparent text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-450"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-crimson hover:bg-crimson/95 text-white font-extrabold text-xs py-2 rounded-xl transition"
              >
                Save to Workspace Vault
              </button>
            </form>

            <div className="lg:col-span-17 bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 p-6 shadow-sm overflow-y-auto max-h-[385px] grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {notes.map(note => (
                <div key={note.id} className="border border-slate-100 dark:border-slate-850 p-4 rounded-xl shadow-sm flex flex-col justify-between h-[135px]">
                  <div>
                    <div className="flex justify-between items-start mb-1 text-[10px] text-slate-400">
                      <span className="font-bold">{note.date}</span>
                      <button onClick={() => handleDeleteNote(note.id)} className="text-slate-350 hover:text-red-500 transition">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{note.title}</h4>
                    <p className="text-xs text-slate-405 leading-normal mt-2 line-clamp-3">{note.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Dynamic Mind Map Builder */}
        {activeTab === 'mindmap' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 p-4 shadow-sm flex items-center justify-center min-h-[320px] relative">
              <svg width="100%" height="300" className="max-w-[420px]">
                {/* Connect branch paths to centerpiece node with ID 1 */}
                {mindNodes.map(node => {
                  if (node.id === '1') return null;
                  const centerNode = mindNodes[0];
                  return (
                    <line
                      key={`link-${node.id}`}
                      x1={centerNode.x}
                      y1={centerNode.y}
                      x2={node.x}
                      y2={node.y}
                      stroke="#e2e8f0"
                      strokeWidth="2.5"
                    />
                  );
                })}

                {/* Draw Node circles and typography labels */}
                {mindNodes.map(node => (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    <circle
                      r={node.id === '1' ? 24 : 16}
                      fill={node.color}
                      className="shadow-md"
                    />
                    <text
                      y={node.id === '1' ? 38 : 28}
                      textAnchor="middle"
                      fontSize="9px"
                      fontWeight="700"
                      className="fill-slate-720 dark:fill-white select-none whitespace-nowrap"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5 pb-2.5 border-b">
                  <Network size={12} className="text-crimson" />
                  <span>Interactive Mind Map Compiler</span>
                </h3>
                <p className="text-xs text-slate-405 leading-relaxed mt-3">
                  Instantly structure active learning trajectories by clustering your active handwritten notes and voice recordings into responsive topological structures.
                </p>
              </div>

              <button
                onClick={handleRegenerateMindmap}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-crimson dark:hover:bg-crimson/90 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow"
              >
                Regenerate Mind Map
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Canvas Board Sandbox */}
        {activeTab === 'canvas' && (
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Whiteboard Workspace */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-inner overflow-hidden flex items-center justify-center p-2 min-h-[310px]">
              <canvas
                ref={canvasRef}
                width={500}
                height={300}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-[300px] border border-slate-50 bg-white cursor-crosshair rounded-xl touch-none"
              />
            </div>

            {/* Canvas Customization Toolbar */}
            <div className="w-full lg:w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl flex flex-row lg:flex-col justify-between lg:justify-start gap-4">
              {/* Color list */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-widest">Brush Color</span>
                <div className="flex lg:grid lg:grid-cols-4 gap-1.5">
                  {['#e11d48', '#4f46e5', '#059669', '#d97706', '#7c3aed', '#090d16'].map(color => (
                    <button
                      key={color}
                      onClick={() => { setBrushColor(color); setIsEraser(false); }}
                      className="w-5.5 h-5.5 rounded-full border border-slate-205 transition relative hover:scale-110 shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {brushColor === color && !isEraser && (
                        <Check size={11} className="text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider size */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-widest">Brush Width ({brushSize}px)</span>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full cursor-pointer h-1.5 bg-slate-100 dark:bg-slate-800 accent-crimson rounded-lg"
                />
              </div>

              {/* Eraser and actions */}
              <div className="flex flex-col gap-2 flex-grow justify-end">
                <button
                  onClick={() => setIsEraser(!isEraser)}
                  className={`w-full text-center py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition border ${
                    isEraser 
                      ? 'bg-crimson text-white border-crimson' 
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-150 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-350'
                  }`}
                >
                  {isEraser ? 'Brush Mode' : 'Toggle Eraser'}
                </button>
                <button
                  onClick={clearCanvas}
                  className="w-full text-center py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition hover:bg-slate-800"
                >
                  Wipe Doodle Board
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Agile study boards (Kanban) */}
        {activeTab === 'kanban' && (
          <div className="space-y-4">
            <form onSubmit={handleAddKanbanCard} className="flex gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-2 rounded-xl max-w-lg">
              <input
                type="text"
                placeholder="Assign a localized thesis task or simulator study detail..."
                value={newKanbanText}
                onChange={(e) => setNewKanbanText(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-transparent border-none text-slate-805 dark:text-white focus:outline-none"
              />
              <button type="submit" className="bg-crimson text-white hover:bg-crimson/95 px-4 rounded-lg flex items-center font-bold text-xs">
                <Plus size={12} className="mr-1" /> Add Card
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* columns */}
              {(['todo', 'progress', 'done'] as const).map(col => {
                const filtered = kanbanCards.filter(c => c.column === col);
                return (
                  <div key={col} className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 min-h-[220px] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center pb-2.5 border-b border-slate-50 dark:border-slate-850">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-404">
                          {col === 'todo' ? '🎯 Study Queue' : col === 'progress' ? '⚡ Active Operations' : '🏆 Completed Trials'}
                        </span>
                        <span className="bg-slate-50 dark:bg-slate-900 border text-slate-400 text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-black">
                          {filtered.length}
                        </span>
                      </div>

                      <div className="space-y-2 mt-3.5 pr-1 max-h-48 overflow-y-auto">
                        {filtered.map(card => (
                          <div key={card.id} className="bg-slate-50 dark:bg-slate-855 border border-slate-150 dark:border-slate-800 p-3 rounded-xl shadow-sm text-xs text-slate-800 dark:text-slate-150">
                            <p className="font-semibold leading-relaxed">{card.title}</p>
                            
                            <div className="flex gap-1.5 justify-end mt-2 pt-2 border-t border-slate-206 dark:border-slate-750">
                              {col !== 'todo' && (
                                <button
                                  onClick={() => moveKanbanCard(card.id, col === 'progress' ? 'todo' : 'progress')}
                                  className="text-[9px] font-bold text-slate-404 hover:text-crimson bg-white dark:bg-slate-900 border dark:border-slate-700 px-1.5 py-0.5 rounded text-center transition"
                                >
                                  ← Back
                                </button>
                              )}
                              {col !== 'done' && (
                                <button
                                  onClick={() => moveKanbanCard(card.id, col === 'todo' ? 'progress' : 'done')}
                                  className="text-[9px] font-bold text-white hover:bg-emerald-600 bg-emerald-500 px-1.5 py-0.5 rounded text-center transition"
                                >
                                  Forward →
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
