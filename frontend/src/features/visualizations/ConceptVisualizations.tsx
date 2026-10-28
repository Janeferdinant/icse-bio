import React, { useState } from 'react';
import { 
  Cpu, ArrowRight, Activity, Zap, BookOpen, ExternalLink
} from 'lucide-react';
import type { NavigationTab } from '../../types';

interface ConceptVisualizationsProps {
  onJumpToPage: (page: number) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const ConceptVisualizations: React.FC<ConceptVisualizationsProps> = ({
  onJumpToPage,
  onNavigateTab
}) => {
  const [selectedViz, setSelectedViz] = useState<'reflex_arc' | 'cell_cycle' | 'menstrual_cycle' | 'double_circulation'>('reflex_arc');
  const [activeStep, setActiveStep] = useState<number>(0);

  // Reflex arc simulation steps
  const reflexSteps = [
    { title: "1. Receptor (Sensory Organ)", desc: "Heat/pain stimulus received by sensory receptors in skin.", color: "text-amber-400" },
    { title: "2. Sensory Neuron", desc: "Transmits afferent electrical impulse via dorsal root into spinal cord.", color: "text-blue-400" },
    { title: "3. Interneuron (Spinal Cord)", desc: "Gray matter association neuron processes impulse and relays to motor neuron.", color: "text-purple-400" },
    { title: "4. Motor Neuron", desc: "Transmits efferent motor command through ventral root to effector muscle.", color: "text-emerald-400" },
    { title: "5. Effector (Biceps Muscle)", desc: "Muscle contracts automatically, withdrawing hand from danger.", color: "text-red-400" }
  ];

  // Cell cycle phases
  const cellCyclePhases = [
    { name: "G1 Phase (Growth 1)", percent: 40, desc: "Rapid cell growth, protein and RNA synthesis, duplication of organelles.", color: "bg-indigo-600" },
    { name: "S Phase (Synthesis)", percent: 30, desc: "DNA replication: chromosome duplicates into two sister chromatids.", color: "bg-purple-600" },
    { name: "G2 Phase (Growth 2)", percent: 20, desc: "Spindle protein synthesis and pre-mitosis checkpoint validation.", color: "bg-wine-600" },
    { name: "M Phase (Mitosis)", percent: 10, desc: "Karyokinesis (Prophase, Metaphase, Anaphase, Telophase) & Cytokinesis.", color: "bg-emerald-600" }
  ];

  // Menstrual cycle 4 phases
  const menstrualPhases = [
    { name: "Menstrual Phase (Days 1-5)", desc: "Breakdown of uterine endometrium lining and bleeding as progesterone drops.", hormone: "Low Estrogen & Progesterone" },
    { name: "Follicular / Proliferative (Days 6-13)", desc: "FSH stimulates Graafian follicle development; Estrogen thickens endometrium.", hormone: "Rising Estrogen (FSH active)" },
    { name: "Ovulatory Phase (Day 14)", desc: "LH Surge triggers rupture of mature Graafian follicle and release of secondary oocyte.", hormone: "LH Surge (Peak Luteinizing Hormone)" },
    { name: "Luteal / Secretory Phase (Days 15-28)", desc: "Corpus luteum secretes high Progesterone to sustain vascular uterine wall for pregnancy.", hormone: "High Progesterone" }
  ];

  const handleNextStep = () => {
    setActiveStep((prev) => (prev + 1) % reflexSteps.length);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-wine-500/20">
        <div>
          <h2 className="text-xl font-heading font-black text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Interactive 2D Concept Visualizations</span>
          </h2>
          <p className="text-xs text-slate-400">
            Interactive diagrams for physiological pathways, cycles, and feedback loops
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-wine-500/20">
          {[
            { id: 'reflex_arc', label: '1. Reflex Arc Pathway' },
            { id: 'cell_cycle', label: '2. Cell Cycle Phases' },
            { id: 'menstrual_cycle', label: '3. Menstrual Cycle' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedViz(tab.id as any);
                setActiveStep(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedViz === tab.id
                  ? 'bg-gradient-to-r from-wine-600 to-indigo-600 text-white shadow-wine-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Diagram Card */}
      <div className="glass-card rounded-2xl p-6 border border-wine-500/20">
        {/* Visual 1: Reflex Arc Flowchart */}
        {selectedViz === 'reflex_arc' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-bold text-white">
                  Reflex Arc: Automatic Involuntary Action Pathway (PDF Page 18)
                </h3>
                <p className="text-xs text-slate-400">
                  Step through the five sequential anatomical components of a spinal reflex
                </p>
              </div>
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-indigo-glow transition-all"
              >
                <span>Trigger Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Pathway Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4">
              {reflexSteps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-gradient-to-b from-indigo-950/80 to-wine-950/60 border-indigo-500 shadow-indigo-glow scale-105'
                        : 'bg-black/30 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-400">Step {idx + 1}</span>
                      {isActive && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                    </div>
                    <h4 className={`text-xs font-bold mb-1.5 ${step.color}`}>{step.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Explanation callout */}
            <div className="p-4 rounded-xl bg-black/40 border border-indigo-500/20 text-xs text-slate-300 flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Why does a reflex bypass the brain?</strong>
                A reflex arc completes within the spinal cord without waiting for conscious interpretation by the cerebrum, saving crucial milliseconds to protect the body from burns, wounds, or severe injury.
              </div>
            </div>
          </div>
        )}

        {/* Visual 2: Cell Cycle Phases */}
        {selectedViz === 'cell_cycle' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-heading font-bold text-white">
                The Cell Cycle & Checkpoints (PDF Page 2)
              </h3>
              <p className="text-xs text-slate-400">
                Interphase (G1, S, G2) takes ~90% of cell life; Mitosis (M phase) takes only ~10%
              </p>
            </div>

            {/* Progress Bar of Cell Cycle */}
            <div className="w-full h-8 rounded-xl bg-black/50 overflow-hidden flex border border-white/10">
              {cellCyclePhases.map((phase, idx) => (
                <div
                  key={idx}
                  style={{ width: `${phase.percent}%` }}
                  className={`${phase.color} h-full flex items-center justify-center text-[11px] font-bold text-white transition-all hover:opacity-90 cursor-pointer`}
                  title={`${phase.name} (${phase.percent}%)`}
                >
                  {phase.name.split(' ')[0]} ({phase.percent}%)
                </div>
              ))}
            </div>

            {/* Phase Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cellCyclePhases.map((phase, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${phase.color}`} />
                    <h4 className="font-heading font-bold text-xs text-white">{phase.name}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{phase.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-wine-500/20 text-xs text-slate-300">
              <strong className="text-white block mb-1">Cell Cycle Checkpoints (Cyclin Regulatory Proteins):</strong>
              Checkpoints at G1/S, G2/M, and Metaphase ensure DNA is error-free before replication and chromosomes are properly attached to spindle fibers before division begins.
            </div>
          </div>
        )}

        {/* Visual 3: Menstrual Cycle */}
        {selectedViz === 'menstrual_cycle' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-heading font-bold text-white">
                Human Female Menstrual Cycle (28 Days) (PDF Page 25)
              </h3>
              <p className="text-xs text-slate-400">
                Coordinated interplay between pituitary hormones (FSH, LH) and ovarian hormones (Estrogen, Progesterone)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {menstrualPhases.map((phase, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-wine-500/20 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-wine-500/20 text-wine-300 font-semibold mb-2 inline-block">
                      Phase {idx + 1}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-white mb-2">{phase.name}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{phase.desc}</p>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/10 text-[11px] font-mono text-wine-300">
                    {phase.hormone}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-wine-500/20 text-xs text-slate-300 flex items-start gap-3">
              <Activity className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">High-Yield Board Fact:</strong>
                Ovulation occurs exactly 14 days before the next menstruation begins, triggered by the sharp mid-cycle <strong>LH Surge</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Global Grounding Footer Bar */}
        <div className="p-4 rounded-2xl glass-card border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-wine-200/70">
            <BookOpen className="w-4 h-4 text-wine-400" />
            <span>Curriculum Grounding: Verified in ICSE Biology Revision Notes</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const pageMap: Record<string, number> = {
                  reflex_arc: 21,
                  cell_cycle: 1,
                  menstrual_cycle: 26,
                  double_circulation: 17
                };
                onJumpToPage(pageMap[selectedViz] || 1);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-wine-600/30 hover:bg-wine-600/50 border border-wine-500/40 text-wine-200 font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>Read Original Page in Explorer</span>
              <ExternalLink className="w-3.5 h-3.5 text-wine-400" />
            </button>
            <button
              onClick={() => onNavigateTab('ask-questions')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>Ask AI About This Model</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
