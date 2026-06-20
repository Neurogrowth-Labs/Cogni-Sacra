import React, { useState, useEffect } from 'react';
import { Microscope, Beaker, Play, RotateCcw, AlertTriangle, Activity, Heart, Thermometer } from 'lucide-react';

export default function VirtualResearchLab() {
  const [activeLab, setActiveLab] = useState<'chemistry' | 'physics' | 'cardiac'>('chemistry');

  // Chemistry Titration Lab state
  const [volumeBase, setVolumeBase] = useState<number>(0); // 0 to 50 ml
  const [phVal, setPhVal] = useState<number>(1.2); // pH starts highly acidic
  const [indicatorColor, setIndicatorColor] = useState<string>('#e2e8f0'); // Neutral clear

  // Physics Pendulum Lab calculations
  const [lengthSlider, setLengthSlider] = useState<number>(120); // Pendulum length
  const [gravitySlider, setGravitySlider] = useState<number>(9.8); // Gravity value
  const [angle, setAngle] = useState<number>(0);
  const [isPlayingPhysics, setIsPlayingPhysics] = useState<boolean>(true);

  // Medical Cardiac diagnostics states
  const [pulseOx, setPulseOx] = useState<number>(98);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [cardiacState, setCardiacState] = useState<'normal' | 'arrhythmia' | 'tachy' | 'brady'>('normal');
  const [ecgPath, setEcgPath] = useState<string>('M 0 50 L 10 50 L 20 50 L 25 30 L 30 70 L 35 50 L 45 50 L 50 50 L 60 50');

  // React on Titration volumes
  useEffect(() => {
    // Standard chemical titration math for strong acid / strong base
    // pH climbs slowly, then leaps exponentially around neutralization volume (e.g. 25 ml), then plateaus near 12.8
    let computedPh = 1.2;
    if (volumeBase < 24) {
      computedPh = 1.2 + (volumeBase * 0.1);
    } else if (volumeBase >= 24 && volumeBase <= 26) {
      // Leap region
      computedPh = 3.6 + (volumeBase - 24) * 3.7;
    } else {
      computedPh = 11.0 + (volumeBase - 26) * 0.08;
    }

    // Clamp pH between 1.2 and 12.8
    computedPh = Math.min(Math.max(parseFloat(computedPh.toFixed(2)), 1.2), 12.8);
    setPhVal(computedPh);

    // Phenolphthalein indicator: clear in acid (pH < 8.2), transitions to deep magenta fuchsia (pH > 10.0)
    if (computedPh < 8.2) {
      setIndicatorColor('bg-slate-100/40 border-slate-200');
    } else if (computedPh >= 8.2 && computedPh <= 9.6) {
      setIndicatorColor('bg-rose-300 dark:bg-rose-500/50 border-rose-400');
    } else {
      setIndicatorColor('bg-fuchsia-600 border-fuchsia-400 animate-pulse');
    }
  }, [volumeBase]);

  // Dynamic Pendulum Physics oscillation tick
  useEffect(() => {
    let animationFrameId: number;
    let t = 0;

    const tick = () => {
      if (isPlayingPhysics) {
        t += 0.05;
        // Period frequency formula T = 2 * pi * sqrt(L/g)
        const period = 2 * Math.PI * Math.sqrt(lengthSlider / (gravitySlider * 10));
        const theta = 35 * Math.sin((2 * Math.PI * t) / period);
        setAngle(theta);
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlayingPhysics, lengthSlider, gravitySlider]);

  // Cardiac Diagnoses effects
  useEffect(() => {
    let heartTimer: any;
    if (cardiacState === 'normal') {
      setHeartRate(72);
      setPulseOx(98);
      setEcgPath('M 0 50 Q 8 50 12 42 T 16 50 L 22 50 L 25 25 L 29 75 L 32 50 L 38 50 Q 42 50 46 54 T 50 50 L 60 50');
    } else if (cardiacState === 'arrhythmia') {
      setHeartRate(58);
      setPulseOx(95);
      setEcgPath('M 0 50 L 8 45 L 12 55 L 18 50 L 21 28 L 25 72 L 28 50 L 36 50 L 40 46 L 43 54 L 50 50 L 60 50');
    } else if (cardiacState === 'tachy') {
      setHeartRate(124);
      setPulseOx(96);
      setEcgPath('M 0 50 L 5 45 T 10 50 L 13 20 L 16 80 L 19 50 L 23 50 T 28 50 Q 32 50 36 40 T 40 50 L 43 20 L 46 80 L 50 50');
    } else {
      setHeartRate(48);
      setPulseOx(92);
      setEcgPath('M 0 50 L 15 50 Q 22 50 26 42 T 30 50 L 40 50 L 43 28 L 47 72 L 50 50 L 60 50');
    }

    return () => clearInterval(heartTimer);
  }, [cardiacState]);

  return (
    <div className="bg-slate-50 dark:bg-slate-905 rounded-3xl p-6 border border-slate-205 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b pb-4">
        <div>
          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/60">
            Feature 11: STEM Virtual Lab & Multi-Subject Simulations
          </span>
          <h2 className="text-xl font-bold font-serif text-slate-850 dark:text-white mt-1.5">Virtual Research Lab</h2>
          <p className="text-xs text-slate-404">Perform experiments digitally under safe, fully parameters-driven academic sandboxes.</p>
        </div>

        {/* Lab select */}
        <div className="flex bg-white dark:bg-slate-850 border border-slate-150 p-1 rounded-xl">
          <button
            onClick={() => setActiveLab('chemistry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeLab === 'chemistry' ? 'bg-crimson text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800'
            }`}
          >
            <Beaker size={11} />
            <span>Chemistry Titration</span>
          </button>
          <button
            onClick={() => setActiveLab('physics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeLab === 'physics' ? 'bg-crimson text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800'
            }`}
          >
            <Microscope size={11} />
            <span>Physics Pendulum</span>
          </button>
          <button
            onClick={() => setActiveLab('cardiac')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeLab === 'cardiac' ? 'bg-crimson text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800'
            }`}
          >
            <Heart size={11} />
            <span>Cardiac Diagnostics</span>
          </button>
        </div>
      </div>

      <div className="min-h-[360px]">
        {/* CHEMISTRY TITRATION */}
        {activeLab === 'chemistry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Live Beaker and Barette Graphics */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 flex gap-12 items-center justify-center min-h-[310px] relative">
              
              {/* Barette container */}
              <div className="flex flex-col items-center relative">
                <span className="text-[8px] font-black uppercase text-slate-400 mb-1">NaOH Burette</span>
                <div className="w-4 h-36 bg-slate-100 border border-slate-300 rounded-md relative flex flex-col justify-end overflow-hidden shadow-inner">
                  {/* Fluid indicator inside barette */}
                  <div className="bg-indigo-400/50 w-full transition-all" style={{ height: `${100 - (volumeBase * 2)}%` }} />
                  {/* Graduations */}
                  <div className="absolute inset-0 flex flex-col justify-between text-[6px] text-slate-400 px-1 font-mono">
                    <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span>
                  </div>
                </div>
                {/* Valve node */}
                <div className="h-4 w-4 bg-slate-800 rounded-full my-1 border relative cursor-all-scroll" />
                {/* Drip point */}
                <div className={`h-2.5 w-1 rounded bg-indigo-500/40 ${volumeBase > 0 ? 'animate-bounce' : ''}`} />
              </div>

              {/* Erlenmeyer beaker container */}
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-black uppercase text-slate-404 mb-1">HCl + Indicator</span>
                <div className="relative w-28 h-32 flex items-end justify-center">
                  {/* Beaker borders styled into Erlenmeyer beaker triangle shape inside transparent vectors */}
                  <div className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-25 border-4 border-slate-300 rounded-t-[50px] rounded-b-[20px]" />
                  {/* Liquid inside Beaker */}
                  <div className={`w-24 h-11 rounded-b-[16px] transition-colors duration-500 border ${indicatorColor}`} />
                  {/* Digital read out */}
                  <div className="absolute bottom-16 bg-slate-950/90 text-white px-2.5 py-1 rounded shadow-lg text-[9.5px] font-mono flex items-center gap-1">
                    <Activity size={10} className="text-emerald-400 animate-pulse" />
                    <span>pH: {phVal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parameter sliders and Chemical Formulas */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Titration parameters</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Adjust sodium hydroxide volume to neutralize absolute hydrochloric acid.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-705 dark:text-slate-300">
                    <span className="font-extrabold">Volume Target Added</span>
                    <span className="font-semibold text-crimson font-mono">{volumeBase} ml</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.1"
                    value={volumeBase}
                    onChange={(e) => setVolumeBase(parseFloat(e.target.value))}
                    className="w-full cursor-pointer h-1.5 bg-slate-100 dark:bg-slate-800 accent-crimson rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 uppercase font-bold pr-1">
                    <span>0 ml (Highly Acidic)</span>
                    <span>25 ml (Equivalence point)</span>
                    <span>50 ml (Highly Basic)</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-xs text-slate-650 dark:text-slate-400 space-y-1">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Chemical Symbology</span>
                  <p className="font-bold text-slate-900 dark:text-white font-mono">HCl (aq) + NaOH (aq) → NaCl (aq) + H₂O (l)</p>
                  <p className="text-[10.5px]">Equivalent concentration: H⁻ ions perfectly binding with OH⁺ compounds to form neutral solutions at pH 7.00.</p>
                </div>
              </div>

              <button
                onClick={() => setVolumeBase(0)}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-crimson dark:hover:bg-crimson/90 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1"
              >
                <RotateCcw size={12} />
                <span>Reset Titration Trial</span>
              </button>
            </div>
          </div>
        )}

        {/* PHYSICS PENDULUM OSCILLATOR */}
        {activeLab === 'physics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Animated Canvas */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm p-6 flex flex-col justify-between items-center min-h-[310px]">
              
              {/* Stand and Bob */}
              <div className="relative w-full h-[220px] flex justify-center bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border">
                {/* Horizontal ceiling */}
                <div className="absolute top-4 w-28 h-2 bg-slate-800 rounded" />
                {/* Visual support pin */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-950" />

                {/* Pendulum cable and weight node box, transforms based on angle state */}
                <div 
                  className="absolute top-6 left-1/2 transition-transform duration-75 origin-top"
                  style={{ 
                    transform: `translateX(-50%) rotate(${angle}deg)`, 
                    height: `${lengthSlider}px` 
                  }}
                >
                  {/* Cable link */}
                  <div className="w-0.5 bg-slate-650 dark:bg-slate-400 h-full mx-auto" />
                  {/* Bob weight */}
                  <div className="w-6 h-6 bg-crimson rounded-full shadow-md border border-white absolute bottom-0 left-1/2 -translate-x-1/2" />
                </div>
              </div>

              <div className="text-[11px] text-slate-404 font-semibold tracking-wide uppercase flex items-center gap-1">
                <Activity size={12} className="text-crimson animate-pulse" />
                <span>Current Pendulum Arc Swing Angle: {angle.toFixed(1)}°</span>
              </div>
            </div>

            {/* Sliders and data reports */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Dynamic parameters</h3>
                  <p className="text-[10px] text-slate-404 mt-0.5">Toggle pendulum thread dimension and local gravitational pulls.</p>
                </div>

                {/* Slider string size */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">Thread Length</span>
                    <span className="font-bold text-crimson font-mono">{lengthSlider} mm</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={lengthSlider}
                    onChange={(e) => setLengthSlider(parseInt(e.target.value))}
                    className="w-full cursor-pointer h-1.5 bg-slate-100 dark:bg-slate-800 accent-crimson rounded-lg"
                  />
                </div>

                {/* Slider gravity */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">Gravitational Acceleration (g)</span>
                    <span className="font-bold text-crimson font-mono">{gravitySlider} m/s²</span>
                  </div>
                  <input
                    type="range"
                    min="1.6"
                    max="24.8"
                    step="0.1"
                    value={gravitySlider}
                    onChange={(e) => setGravitySlider(parseFloat(e.target.value))}
                    className="w-full cursor-pointer h-1.5 bg-slate-100 dark:bg-slate-800 accent-crimson rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 uppercase font-black">
                    <span>Moon (1.6 m/s²)</span>
                    <span>Earth (9.8 m/s²)</span>
                    <span>Jupiter (24.8 m/s²)</span>
                  </div>
                </div>

                {/* Period math formula */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-sans text-slate-404 text-[10.5px]">
                  Formula: <span className="font-bold font-serif text-slate-900 dark:text-white">T = 2π × √(L / g)</span>
                  <p className="mt-1">Computed Oscillation Period: <strong className="text-slate-800 dark:text-white font-mono">{(2 * Math.PI * Math.sqrt(lengthSlider / (gravitySlider * 10))).toFixed(3)} seconds</strong></p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsPlayingPhysics(!isPlayingPhysics)}
                  className="flex-1 bg-crimson hover:bg-crimson/90 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1"
                >
                  <Play size={12} />
                  <span>{isPlayingPhysics ? 'Pause Swing' : 'Unpause Oscillation'}</span>
                </button>
                <button
                  onClick={() => { setLengthSlider(120); setGravitySlider(9.8); setAngle(0); }}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-white p-2.5 rounded-xl transition"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CARDIAC ECG DIAGNOSTICS */}
        {activeLab === 'cardiac' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Animated Oscilloscope monitor */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl border-4 border-slate-800 shadow-2xl p-5 flex flex-col justify-between items-center min-h-[310px] text-emerald-400 font-mono">
              <div className="w-full flex justify-between items-center text-[10px] pb-2 border-b border-emerald-950 text-emerald-500">
                <span className="flex items-center gap-1">
                  <Activity size={12} className="text-emerald-400 animate-pulse" />
                  <span>VITAL SIGNS OSCILLOSCOPE MONITOR v2.04</span>
                </span>
                <span className="font-bold uppercase tracking-wider text-crimson">LIVE SIGNAL</span>
              </div>

              {/* Heart and ECG grid graphs */}
              <div className="w-full h-36 border border-emerald-950/40 rounded bg-black relative flex items-center justify-center">
                
                {/* SVG ECG wave trace */}
                <svg className="w-full h-full absolute inset-0 text-emerald-405">
                  <path
                    d={ecgPath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="animate-pulse"
                    transform="scale(8.33, 1.4) translate(0, 0)"
                  />
                </svg>

                {/* Right side overlays */}
                <div className="absolute right-3.5 top-3.5 bg-slate-950/80 p-2.5 rounded border border-emerald-950 space-y-1.5 text-right font-sans min-w-[76px]">
                  <div className="leading-none">
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 block font-black">Pulse Rate</span>
                    <span className="text-base font-black text-emerald-400 font-mono">{heartRate} <span className="text-[10px]">bpm</span></span>
                  </div>
                  <div className="leading-none pt-1 border-t border-emerald-950/50">
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 block font-black">SPO₂ Ox</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">{pulseOx}%</span>
                  </div>
                </div>
              </div>

              <div className="w-full text-left text-[10.5px] border-t border-emerald-950/50 pt-2 flex items-center justify-between">
                <span>Diagnostic Category: <strong className="text-white uppercase font-sans text-[11px]">{cardiacState} Sinus Track</strong></span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* Parameters, diagnostics trigger buttons */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Trigger ECG Signatures</h3>
                  <p className="text-[10px] text-slate-404 mt-0.5">Toggle dynamic cardiac parameters of healthy vs compromised hearts.</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'normal', label: 'Sinus Normal', desc: 'Typical healthy rate (60-100 bpm)' },
                    { id: 'arrhythmia', label: 'Sinus Arrhythmia', desc: 'Irregular rhythm intervals' },
                    { id: 'tachy', label: 'Sinus Tachycardia', desc: 'Accelerated sinus beats' },
                    { id: 'brady', label: 'Sinus Bradycardia', desc: 'Slowed pace bradycard' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setCardiacState(item.id as any)}
                      className={`text-left p-2.5 rounded-xl border transition-all ${
                        cardiacState === item.id 
                          ? 'bg-crimson/5 border-crimson/30 ring-1 ring-crimson' 
                          : 'bg-white hover:bg-slate-50 dark:bg-slate-805 dark:border-slate-750'
                      }`}
                    >
                      <h4 className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-none">{item.label}</h4>
                      <p className="text-[9px] text-slate-404 leading-normal mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-red-50 dark:bg-slate-950 border border-crimson/15 rounded-xl flex gap-2 items-start text-[10px] leading-relaxed text-slate-650 dark:text-slate-404">
                  <AlertTriangle size={14} className="text-crimson shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black uppercase text-crimson block mb-0.5">Emergency Diagnostics Guide</span>
                    <span>An extreme Tachycardia waveform (rate &gt; 120 bpm) suggests stress tests or anti-arrhythmic agents depending on patient age limits.</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-semibold text-center italic mt-6">
                💡 ECG graphics are mathematically simulated using SVG path wave calculations.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
