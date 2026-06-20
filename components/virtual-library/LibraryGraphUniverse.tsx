import React, { useState } from 'react';
import { Search, Compass, Network, Award, Milestone, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  description: string;
  connectedTo: string[];
}

const INITIAL_NODES: Node[] = [
  { id: 'center', label: 'Circular Economy', category: 'Sustainable Systems', x: 250, y: 250, description: 'An industrial system that is restorative or regenerative by intention and design. Focuses on Africa-wide localized closed loops.', connectedTo: ['energy', 'policy', 'agri', 'mfg', 'waste'] },
  { id: 'energy', label: 'Renewable Power Systems', category: 'Engineering & Technology', x: 100, y: 130, description: 'Decentralized microgrid layouts and modular clean wind/solar solutions for rural African grids.', connectedTo: ['center', 'agri'] },
  { id: 'policy', label: 'Environmental Law', category: 'Public Policy', x: 400, y: 130, description: 'Pan-African legal guidelines governing waste stream responsibilities and carbon sequestration targets.', connectedTo: ['center', 'waste'] },
  { id: 'agri', label: 'Agroecology Systems', category: 'Agriculture & Science', x: 100, y: 370, description: 'Integrating modern organic nutrient re-uptakes with indigenous African crop rotation standards.', connectedTo: ['center', 'energy'] },
  { id: 'mfg', label: 'Inclusive Eco-design', category: 'Economics & Industry', x: 400, y: 370, description: 'Micro-manufacturing techniques optimizing local materials (sisal, bamboo, hemp) in industrial designs.', connectedTo: ['center'] },
  { id: 'waste', label: 'Municipal Waste Recovery', category: 'Environmental Science', x: 250, y: 70, description: 'Advanced municipal upcycling centers converting bio-waste to high-value fertilizers in rapid urban zones.', connectedTo: ['center', 'policy'] }
];

export default function LibraryGraphUniverse() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('center');
  const [inputValue, setInputValue] = useState<string>('');
  const [isGeneratingPath, setIsGeneratingPath] = useState<boolean>(false);
  const [generatedPath, setGeneratedPath] = useState<string[] | null>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Simulate topic clustering for other terms
    const query = inputValue.trim();
    const newNodes = [
      { id: 'center', label: query, category: 'Central Inquiry', x: 250, y: 250, description: `The primary node of ${query}. Dynamic clustering mapped elements based on deep repository metadata.`, connectedTo: ['node1', 'node2', 'node3', 'node4'] },
      { id: 'node1', label: `${query} Socio-Ethics`, category: 'Sociology & Public Good', x: 100, y: 150, description: `Exploring the human-centric and regulatory guidelines mapping to ${query}.`, connectedTo: ['center'] },
      { id: 'node2', label: `Advanced Applied ${query}`, category: 'Computational STEM', x: 400, y: 150, description: `High-fidelity modeling, sandbox simulations, and algorithm structures of ${query}.`, connectedTo: ['center'] },
      { id: 'node3', label: `Climate-Impact & ${query}`, category: 'Global Sustainability', x: 120, y: 350, description: `Ecological and long-term climate adjustments connected with ${query}.`, connectedTo: ['center'] },
      { id: 'node4', label: `${query} Economics`, category: 'African Market Systems', x: 380, y: 350, description: `Translating the technological core of ${query} into viable community markets.`, connectedTo: ['center'] },
    ];
    setNodes(newNodes);
    setSelectedNodeId('center');
    setGeneratedPath(null);
  };

  const triggerGeneratePath = () => {
    setIsGeneratingPath(true);
    setTimeout(() => {
      setIsGeneratingPath(false);
      setGeneratedPath([
        `Foundations of ${selectedNode.label}`,
        `Core Methodologies & Case Studies in Sub-Saharan regions`,
        `Advanced Architectural Integrations & Sandbox testing`,
        `Synthesized Thesis defense & Peer Review publications`
      ]);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-905 rounded-3xl p-6 border border-slate-205 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <span className="bg-crimson/10 text-crimson text-xs font-black uppercase px-2.5 py-1 rounded-full border border-crimson/20">
            Intelligent Discovery Mode
          </span>
          <h2 className="text-xl font-bold font-serif text-slate-850 dark:text-white mt-1.5">AI Knowledge Universe</h2>
          <p className="text-xs text-slate-404">Discover multi-disciplinary intersections with dynamic clustering maps.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full lg:w-96">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Climate Change, Machine Learning..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full pl-9 px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-805 text-slate-800 dark:text-slate-100 font-medium focus:ring-1 focus:ring-crimson focus:outline-none"
            />
          </div>
          <button type="submit" className="bg-crimson hover:bg-crimson/90 text-white font-bold text-xs px-4 py-2 rounded-xl transition duration-300">
            Cluster
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Screen Graph */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm overflow-hidden relative min-h-[420px] flex items-center justify-center">
          
          <div className="absolute top-4 left-4 flex gap-1.5 text-[10px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-slate-650 dark:text-slate-300 font-bold">
            <Network size={12} className="text-crimson" />
            <span>Interactive Node Topology</span>
          </div>

          <svg width="100%" height="100%" viewBox="0 0 500 450" className="max-w-[450px]">
            {/* Draw Links */}
            {nodes.map(node => (
              node.connectedTo.map(targetId => {
                const targetNode = nodes.find(n => n.id === targetId);
                if (!targetNode) return null;
                const isHighlighted = selectedNodeId === node.id || selectedNodeId === targetId;
                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={node.x}
                    y1={node.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHighlighted ? '#e11d48' : '#cbd5e1'}
                    strokeWidth={isHighlighted ? 2.5 : 1}
                    strokeDasharray={isHighlighted ? '0' : '4 4'}
                    className="transition-all duration-300"
                  />
                );
              })
            ))}

            {/* Draw Nodes */}
            {nodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const isCenter = node.id === 'center';
              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isCenter ? 32 : 18}
                    fill={isSelected ? '#e11d48' : (isCenter ? '#0f172a' : '#ffffff')}
                    stroke={isSelected ? '#fda4af' : '#cbd5e1'}
                    strokeWidth={isSelected ? 4 : 1.5}
                    className="transition-all duration-300 dark:fill-dark shadow group-hover:scale-110"
                  />
                  {/* Icon or symbol shorthand */}
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={isCenter ? '10px' : '9px'}
                    fontWeight="900"
                    fill={isSelected ? '#ffffff' : (isCenter ? '#ffffff' : '#475569')}
                    className="select-none font-sans"
                  >
                    {isCenter ? 'ECO' : node.label.substring(0, 3).toUpperCase()}
                  </text>
                  {/* Tooltip labels within standard coordinates */}
                  <text
                    y={isCenter ? 44 : 26}
                    textAnchor="middle"
                    fontSize="10px"
                    fontWeight="800"
                    fill={isSelected ? '#e11d48' : '#1e293b'}
                    className="select-none fill-slate-900 dark:fill-white drop-shadow-sm pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details side panel */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-5 shadow-sm">
          <div>
            <div className="flex justify-between items-start gap-2 mb-3">
              <span className="bg-slate-100 dark:bg-slate-800 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded text-slate-500">
                {selectedNode.category}
              </span>
              <Compass size={16} className="text-slate-400" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">{selectedNode.label}</h3>
            <p className="text-xs text-slate-405 leading-relaxed mt-2.5">{selectedNode.description}</p>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Interdisciplinary Connections</h4>
              <div className="space-y-1.5">
                {selectedNode.connectedTo.map(cid => {
                  const sibling = nodes.find(n => n.id === cid);
                  if (!sibling) return null;
                  return (
                    <div 
                      key={cid}
                      onClick={() => setSelectedNodeId(cid)}
                      className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-350 hover:text-crimson dark:hover:text-crimson cursor-pointer transition py-0.5 font-medium"
                    >
                      <ArrowRight size={11} className="text-indigo-500" />
                      <span>{sibling.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={triggerGeneratePath}
              disabled={isGeneratingPath}
              className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 dark:bg-crimson dark:hover:bg-crimson/90 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition duration-300"
            >
              <Sparkles size={13} className={isGeneratingPath ? 'animate-spin' : ''} />
              <span>{isGeneratingPath ? 'Mapping AI Trail...' : 'Generate Learning Pathway'}</span>
            </button>

            {generatedPath && (
              <div className="mt-4 p-3 bg-red-50/50 dark:bg-crimson/5 rounded-xl border border-crimson/10 space-y-2.5 animate-fade-in text-[11px]">
                <div className="flex items-center gap-1.5 text-crimson font-black uppercase text-[9px] tracking-widest">
                  <Milestone size={12} />
                  <span>Custom Adaptive Trail Map</span>
                </div>
                <div className="space-y-2 relative border-l border-slate-200 dark:border-slate-700 pl-3.5 ml-1">
                  {generatedPath.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* circular tracker bullet */}
                      <span className="absolute left-[-18.5px] top-1 w-2.5 h-2.5 rounded-full bg-crimson border-2 border-white dark:border-slate-900" />
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{step}</span>
                      <span className="text-[9px] text-slate-404 block mt-0.5">Est. Study: {idx === 0 ? '2 hours' : '1.5 weeks'}</span>
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
}
