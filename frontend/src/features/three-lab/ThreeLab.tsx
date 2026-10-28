import React, { useState } from 'react';
import { 
  Play, Pause, RotateCcw, Box, Sliders, 
  HelpCircle, BookOpen, Sparkles, Sun, Moon, Droplets
} from 'lucide-react';
import { HeartScene } from './scenes/HeartScene';
import { NephronScene } from './scenes/NephronScene';
import { EyeDefectScene } from './scenes/EyeDefectScene';
import { StomataScene } from './scenes/StomataScene';
import { DnaHelixScene } from './scenes/DnaHelixScene';
import { PhysicsNnPanel } from './physics-nn/PhysicsNnPanel';
import { evaluateStomataPinn } from './physics-nn/stomataPinn';
import { evaluateEyeOpticsPinn } from './physics-nn/eyeOpticsPinn';
import { evaluateHemodynamicsPinn } from './physics-nn/hemodynamicsPinn';
import type { PinnEvaluation } from './physics-nn/types';
import type { NavigationTab } from '../../types';

interface ThreeLabProps {
  initialDemoId?: string;
  onJumpToPage: (page: number) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const ThreeLab: React.FC<ThreeLabProps> = ({
  initialDemoId = 'stomata_turgor',
  onJumpToPage,
  onNavigateTab
}) => {
  const [selectedDemo, setSelectedDemo] = useState<string>(initialDemoId);

  // Heart Controls
  const [heartRate, setHeartRate] = useState<number>(72);
  const [isPumping, setIsPumping] = useState<boolean>(true);
  const [selectedChamber, setSelectedChamber] = useState<string | null>(null);

  // Nephron Controls
  const [ghp, setGhp] = useState<number>(55);
  const [bop, setBop] = useState<number>(30);
  const [chp, setChp] = useState<number>(15);
  const [adhLevel, setAdhLevel] = useState<number>(60);

  // Eye Controls
  const [visionMode, setVisionMode] = useState<'normal' | 'myopia' | 'myopia_corrected' | 'hyperopia' | 'hyperopia_corrected'>('normal');
  const [accommodation, setAccommodation] = useState<number>(50);

  // Stomata Controls
  const [turgor, setTurgor] = useState<number>(75);
  const [kIon, setKIon] = useState<number>(80);
  const [lightCondition, setLightCondition] = useState<'day' | 'night' | 'drought'>('day');

  // DNA Controls
  const [dnaSpeed, setDnaSpeed] = useState<number>(1);
  const [uncoil, setUncoil] = useState<number>(10);

  // Quiz State
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const demos = [
    { id: 'stomata_turgor', label: '1. Realistic Stomata (Turgor & Osmosis)', unit: 4, page: 7, chapterTitle: 'Transpiration' },
    { id: 'eye_defect', label: '2. Realistic Eye (Optics & Correction)', unit: 9, page: 19, chapterTitle: 'The Nervous System & Sense Organs' },
    { id: 'human_heart', label: '3. Realistic 4-Chamber Heart', unit: 7, page: 13, chapterTitle: 'The Circulatory System' },
    { id: 'nephron_filtration', label: '4. Nephron Filtration', unit: 8, page: 15, chapterTitle: 'The Excretory System' },
    { id: 'dna_helix', label: '5. DNA Double Helix', unit: 1, page: 1, chapterTitle: 'Cell Cycle & Chromosomes' }
  ];

  const currentDemo = demos.find((d) => d.id === selectedDemo) || demos[0];

  // Evaluate live Physics-Informed Neural Network (PINN) based on active sliders
  let currentEvaluation: PinnEvaluation;
  if (selectedDemo === 'stomata_turgor') {
    currentEvaluation = evaluateStomataPinn(turgor, kIon, lightCondition);
  } else if (selectedDemo === 'eye_defect') {
    currentEvaluation = evaluateEyeOpticsPinn(visionMode, accommodation);
  } else if (selectedDemo === 'human_heart') {
    currentEvaluation = evaluateHemodynamicsPinn(heartRate, isPumping);
  } else {
    // Default fallback calculation
    currentEvaluation = evaluateStomataPinn(turgor, kIon, lightCondition);
  }

  const handleReset = () => {
    setHeartRate(72);
    setIsPumping(true);
    setSelectedChamber(null);
    setGhp(55);
    setBop(30);
    setChp(15);
    setAdhLevel(60);
    setVisionMode('normal');
    setAccommodation(50);
    setTurgor(75);
    setKIon(80);
    setLightCondition('day');
    setDnaSpeed(1);
    setUncoil(10);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Demo Selector Header */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-rose-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-rose-950/30">
        <div>
          <h2 className="text-xl font-heading font-black text-white tracking-tight flex items-center gap-2">
            <Box className="w-5 h-5 text-rose-400" />
            <span>Interactive 3D Biological Laboratory</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/30">
              5th Grade & PINN Edition
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Anatomically realistic 3D models with Physics-Informed Neural Network simulation and friendly voice-over narration
          </p>
        </div>

        {/* Demo Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-rose-500/20">
          {demos.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDemo(d.id);
                setSelectedChamber(null);
                setQuizAnswer(null);
                setQuizSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDemo === d.id
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-lg shadow-rose-600/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas + Control Workspace (Dual Lab Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Scene Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-2xl p-4 border border-rose-500/20 relative bg-black/40">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{currentDemo.label}</span>
                <button
                  onClick={() => {
                    onJumpToPage(currentDemo.page);
                    onNavigateTab('pdf-explorer');
                  }}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors border border-rose-500/30 flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>PDF Page {currentDemo.page}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                  title="Reset to default initial parameters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* 3D Scene Renderer */}
            {selectedDemo === 'stomata_turgor' && (
              <StomataScene
                turgorPressure={turgor}
                kIonConcentration={kIon}
                lightCondition={lightCondition}
                selectedPart={selectedChamber}
                onSelectPart={(part) => setSelectedChamber(part)}
              />
            )}

            {selectedDemo === 'eye_defect' && (
              <EyeDefectScene
                visionMode={visionMode}
                accommodation={accommodation}
                selectedComponent={selectedChamber}
                onSelectComponent={(comp) => setSelectedChamber(comp)}
              />
            )}

            {selectedDemo === 'human_heart' && (
              <HeartScene
                heartRate={heartRate}
                isPumping={isPumping}
                activeChamber={selectedChamber}
                onSelectChamber={(c) => setSelectedChamber(c)}
                showValves={true}
                bloodFlowSpeed={heartRate / 72}
              />
            )}

            {selectedDemo === 'nephron_filtration' && (
              <NephronScene
                ghp={ghp}
                bop={bop}
                chp={chp}
                adhLevel={adhLevel}
                selectedPart={selectedChamber}
                onSelectPart={(p) => setSelectedChamber(p)}
              />
            )}

            {selectedDemo === 'dna_helix' && (
              <DnaHelixScene
                rotationSpeed={dnaSpeed}
                uncoilLevel={uncoil}
                highlightBasePairs={true}
              />
            )}
          </div>

          {/* Scientific Concept & Step-by-Step Explanation */}
          <div className="glass-card rounded-2xl p-5 border border-rose-500/20">
            <h3 className="font-heading font-bold text-sm text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Syllabus Grounding & Physiological Mechanism</span>
            </h3>

            {selectedDemo === 'stomata_turgor' && (
              <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong>Potassium Ion & Turgor Mechanism (PDF Page 7):</strong> During daylight, active transport of $K^+$ ions into guard cells creates an osmotic draw that pulls water in by endosmosis.
                </p>
                <div className="p-3 rounded-xl bg-black/40 font-mono text-emerald-300 text-xs border border-emerald-500/20">
                  Osmotic Equilibrium: &Delta;P = &Pi;<sub>in</sub> - &Pi;<sub>out</sub> &rarr; Inner wall stays rigid while outer wall stretches, bowing the guard cell outward!
                </div>
              </div>
            )}

            {selectedDemo === 'eye_defect' && (
              <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong>Myopia vs Hyperopia Optical Correction (PDF Page 19):</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Myopia (Nearsightedness):</strong> Eyeball is lengthened. Light rays converge in front of the retina. Corrected by wearing a <em>concave (diverging) lens</em>.</li>
                  <li><strong>Hyperopia (Farsightedness):</strong> Eyeball is shortened. Light rays converge behind the retina. Corrected by wearing a <em>convex (converging) lens</em>.</li>
                </ul>
              </div>
            )}

            {selectedDemo === 'human_heart' && (
              <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong>Cardiac Cycle & Valve Dynamics (PDF Page 13):</strong> The human heart acts as a double pump. During ventricular systole, high pressure forces blood into the pulmonary artery and aorta. The <em>Tricuspid</em> and <em>Bicuspid (Mitral)</em> valves snap shut, producing the first heart sound (<strong>LUB</strong>).
                </p>
                <div className="p-3 rounded-xl bg-black/40 font-mono text-rose-300 text-xs border border-rose-500/20">
                  Cardiac Output = Stroke Volume &times; Heart Rate = 70 ml &times; {heartRate} bpm = {(70 * heartRate / 1000).toFixed(2)} L/min
                </div>
              </div>
            )}

            {selectedDemo === 'nephron_filtration' && (
              <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong>Ultrafiltration Mechanism (PDF Page 15):</strong> Blood enters the glomerulus through the wide afferent arteriole and leaves through the narrower efferent arteriole, producing a high hydrostatic pressure of 55 mm Hg.
                </p>
              </div>
            )}

            {selectedDemo === 'dna_helix' && (
              <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong>Chromatin & Nucleosome Organization (PDF Page 1):</strong> DNA wraps twice around a core of 8 histone proteins forming a nucleosome, compacting 2 meters of genetic material into each microscopic cell nucleus.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Physics-NN AI Dashboard + Dr. Bio Guide + Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Physics-NN & Dr. Bio Voice Guide */}
          <PhysicsNnPanel
            demoId={selectedDemo}
            evaluation={currentEvaluation}
            selectedComponent={selectedChamber}
            onSelectComponent={(comp) => setSelectedChamber(comp)}
          />

          {/* 2. Interactive Physical Controls Panel */}
          <div className="glass-card rounded-2xl p-5 border border-rose-500/20">
            <h4 className="font-heading font-bold text-sm text-white mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" />
              <span>Interactive Model Parameters</span>
            </h4>

            {/* Stomata Controls */}
            {selectedDemo === 'stomata_turgor' && (
              <div className="space-y-4">
                {/* Light Condition Buttons */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Environment Lighting:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'day', label: 'Daylight', icon: Sun, color: 'text-amber-400' },
                      { id: 'night', label: 'Night', icon: Moon, color: 'text-indigo-400' },
                      { id: 'drought', label: 'Drought', icon: Droplets, color: 'text-rose-400' }
                    ].map((cond) => {
                      const Icon = cond.icon;
                      const isSelected = lightCondition === cond.id;
                      return (
                        <button
                          key={cond.id}
                          onClick={() => setLightCondition(cond.id as any)}
                          className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                            isSelected
                              ? 'bg-rose-600/30 border-rose-500 text-white font-bold'
                              : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${cond.color}`} />
                          <span>{cond.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Guard Cell Water Turgor</span>
                    <span className="font-mono text-emerald-400 font-bold">{turgor}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={turgor}
                    onChange={(e) => setTurgor(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>Flaccid / Closed (0%)</span>
                    <span>Turgid / Open (100%)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Potassium (K⁺) Ion Concentration</span>
                    <span className="font-mono text-sky-400 font-bold">{kIon}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={kIon}
                    onChange={(e) => setKIon(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Eye Controls */}
            {selectedDemo === 'eye_defect' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Vision Condition:</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'normal', label: '1. Normal Vision (Emmetropia)' },
                      { id: 'myopia', label: '2. Myopia (Short-sightedness)' },
                      { id: 'myopia_corrected', label: '3. Myopia + Concave Lens' },
                      { id: 'hyperopia', label: '4. Hyperopia (Long-sightedness)' },
                      { id: 'hyperopia_corrected', label: '5. Hyperopia + Convex Lens' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setVisionMode(mode.id as any)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                          visionMode === mode.id
                            ? 'bg-rose-600/30 border-rose-500 text-white font-bold'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Ciliary Lens Accommodation</span>
                    <span className="font-mono text-sky-400 font-bold">{accommodation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={accommodation}
                    onChange={(e) => setAccommodation(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>Distant Object (Flat)</span>
                    <span>Close Book (Fat)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Heart Controls */}
            {selectedDemo === 'human_heart' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Heart Rate (BPM)</span>
                    <span className="font-mono text-rose-400 font-bold">{heartRate} bpm</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="180"
                    value={heartRate}
                    onChange={(e) => setHeartRate(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>Rest (40)</span>
                    <span>Normal (72)</span>
                    <span>Athletic Sprint (180)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Pumping Movement</span>
                  <button
                    onClick={() => setIsPumping(!isPumping)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isPumping ? 'bg-rose-600 text-white' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {isPumping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPumping ? 'Pumping' : 'Paused'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Nephron Controls */}
            {selectedDemo === 'nephron_filtration' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Glomerular Hydrostatic (GHP)</span>
                    <span className="font-mono text-emerald-400">{ghp} mm Hg</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="75"
                    value={ghp}
                    onChange={(e) => setGhp(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* DNA Controls */}
            {selectedDemo === 'dna_helix' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Uncoiling Level</span>
                    <span className="font-mono text-purple-400 font-bold">{uncoil}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={uncoil}
                    onChange={(e) => setUncoil(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Quick Knowledge Check Quiz */}
          <div className="glass-card rounded-2xl p-5 border border-rose-500/20">
            <h4 className="font-heading font-bold text-sm text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-rose-400" />
              <span>3D Knowledge-Check Quiz</span>
            </h4>

            {selectedDemo === 'stomata_turgor' && (
              <div>
                <p className="text-xs text-slate-300 mb-3">
                  Why does the guard cell bow outward when it becomes turgid with water?
                </p>
                <div className="space-y-1.5 mb-3">
                  {[
                    'The inner wall is thick and inelastic, while the outer wall is thin and stretchy',
                    'The outer wall has heavy iron plates',
                    'The chloroplasts pull the cells apart'
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuizAnswer(idx)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        quizAnswer === idx
                          ? 'bg-rose-600/30 border-rose-500 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizSubmitted ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300">
                    {quizAnswer === 0 ? "✓ Correct! The differential wall elasticity forces the bean curvature." : "✕ Incorrect. The thick inner wall acts like an unyielding belt."}
                  </div>
                ) : (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={quizAnswer === null}
                    className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 disabled:opacity-40 transition-all"
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            )}

            {selectedDemo === 'human_heart' && (
              <div>
                <p className="text-xs text-slate-300 mb-3">
                  Which valve prevents backflow of deoxygenated blood into the right atrium?
                </p>
                <div className="space-y-1.5 mb-3">
                  {['Bicuspid Valve', 'Tricuspid Valve', 'Semilunar Valve'].map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuizAnswer(idx)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        quizAnswer === idx
                          ? 'bg-rose-600/30 border-rose-500 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizSubmitted ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300">
                    {quizAnswer === 1 ? "✓ Correct! Tricuspid valve guards the right AV orifice." : "✕ Incorrect. The Tricuspid valve has three flaps and guards the right side."}
                  </div>
                ) : (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={quizAnswer === null}
                    className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 disabled:opacity-40 transition-all"
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            )}

            {selectedDemo === 'eye_defect' && (
              <div>
                <p className="text-xs text-slate-300 mb-3">
                  A person with Myopia has an eyeball that is:
                </p>
                <div className="space-y-1.5 mb-3">
                  {['Too short front-to-back', 'Too long front-to-back', 'Normal in length'].map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuizAnswer(idx)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        quizAnswer === idx
                          ? 'bg-rose-600/30 border-rose-500 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizSubmitted ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300">
                    {quizAnswer === 1 ? "✓ Correct! Eyeball elongation causes light rays to converge before the retina." : "✕ Incorrect. Myopia is caused by an elongated eyeball."}
                  </div>
                ) : (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={quizAnswer === null}
                    className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold disabled:opacity-40 transition-all"
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            )}

            {(selectedDemo === 'nephron_filtration' || selectedDemo === 'dna_helix') && (
              <div>
                <p className="text-xs text-slate-300 mb-3">
                  Adenine binds to Thymine via how many hydrogen bonds?
                </p>
                <div className="space-y-1.5 mb-3">
                  {['1 Bond', '2 Bonds', '3 Bonds'].map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuizAnswer(idx)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        quizAnswer === idx
                          ? 'bg-rose-600/30 border-rose-500 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizSubmitted ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300">
                    {quizAnswer === 1 ? "✓ Correct! 2 hydrogen bonds between A and T." : "✕ Incorrect. Adenine and Thymine share 2 hydrogen bonds."}
                  </div>
                ) : (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={quizAnswer === null}
                    className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold disabled:opacity-40 transition-all"
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
