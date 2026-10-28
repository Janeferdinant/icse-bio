import React, { useState } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  ListOrdered,
  Eye,
  RotateCcw,
  Send
} from 'lucide-react';
import katex from 'katex';
import type { ProblemSolution } from '../../types';
import { solveProblem } from '../../services/api';

interface ProblemSolverProps {
  onNavigateToPage?: (page: number) => void;
}

const PRESET_PROBLEMS = [
  {
    title: "Cardiac Output Calculation",
    badge: "Unit 7: Circulation",
    prompt: "Calculate the cardiac output of an athlete whose resting heart rate is 75 beats per minute and stroke volume is 70 ml per beat. Express the answer in both ml/min and Litres/min.",
    page: 17
  },
  {
    title: "Net Renal Filtration Pressure",
    badge: "Unit 8: Excretory System",
    prompt: "In a healthy human kidney, glomerular hydrostatic pressure is 55 mmHg, blood colloidal osmotic pressure is 30 mmHg, and capsular hydrostatic pressure is 15 mmHg. Calculate the Net Filtration Pressure (NFP) and state its physiological significance.",
    page: 20
  },
  {
    title: "Mendelian Monohybrid Genetics Cross",
    badge: "Unit 2: Genetics",
    prompt: "A pure-breeding tall pea plant (TT) is crossed with a pure-breeding dwarf pea plant (tt). Show the F1 and F2 generations using a Punnett square, and state the phenotypic and genotypic ratios of the F2 generation.",
    page: 4
  },
  {
    title: "Human Sex Determination Probability",
    badge: "Unit 2: Genetics",
    prompt: "Using a genetic cross diagram, explain why the probability of a human couple having a boy or a girl in any pregnancy is always exactly 50% (1:1), and identify which parent determines the sex of the child.",
    page: 5
  }
];

export const ProblemSolver: React.FC<ProblemSolverProps> = ({ onNavigateToPage }) => {
  const [problemInput, setProblemInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<ProblemSolution | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [showAllSteps, setShowAllSteps] = useState(true);
  const [showHint, setShowHint] = useState(false);

  const handleSolve = async (textToSolve?: string) => {
    const query = textToSolve || problemInput;
    if (!query.trim()) return;
    
    setLoading(true);
    setShowHint(false);
    try {
      const res = await solveProblem(query);
      setSolution(res);
      setActiveStepIndex(0);
    } catch (err) {
      console.error('Error solving problem:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderKatex = (math?: string) => {
    if (!math) return null;
    try {
      const html = katex.renderToString(math, { throwOnError: false, displayMode: true });
      return <div className="overflow-x-auto py-2" dangerouslySetInnerHTML={{ __html: html }} />;
    } catch {
      return <code className="block p-2 bg-black/40 rounded font-mono text-wine-200">{math}</code>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="glass-panel p-6 border-l-4 border-l-wine-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-wine-500/20 text-wine-400 ring-1 ring-wine-500/30">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Step-by-Step Numerical & Genetics Solver
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-wine-500/20 text-wine-300 border border-wine-500/30 font-medium">
                  ICSE Grounded Engine
                </span>
              </h1>
              <p className="text-sm text-wine-200/70 mt-0.5">
                Solve physiological calculations, renal pressures, and Mendelian genetic crosses with complete mathematical steps & ICSE textbook citations.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-wine-200/60 bg-black/30 px-3 py-2 rounded-lg border border-white/5">
          <BookOpen className="w-4 h-4 text-wine-400" />
          <span>Strictly grounded in ICSE Biology Revision Notes</span>
        </div>
      </div>

      {/* Preset Problem Selectors */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-wine-300/80 mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-wine-400" />
          High-Yield ICSE Board Examination Presets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_PROBLEMS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setProblemInput(preset.prompt);
                handleSolve(preset.prompt);
              }}
              className="text-left p-4 rounded-xl glass-card hover:border-wine-500/50 hover:bg-wine-950/30 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-wine-500/10 text-wine-300 border border-wine-500/20">
                  {preset.badge}
                </span>
                <span className="text-[10px] text-wine-300/60">p. {preset.page}</span>
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-wine-200 transition-colors mb-1">
                {preset.title}
              </h3>
              <p className="text-xs text-wine-200/60 line-clamp-2">
                {preset.prompt}
              </p>
              <div className="mt-3 flex items-center text-xs text-wine-400 font-medium group-hover:translate-x-1 transition-transform">
                <span>Solve Step-by-Step</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="glass-panel p-5 space-y-3">
        <label htmlFor="problem-input" className="block text-sm font-medium text-white flex items-center justify-between">
          <span>Type or Paste Any Biology Problem / Cross:</span>
          <span className="text-xs text-wine-300/60">Supports math notation, genetics crosses, and physiological equations</span>
        </label>
        <div className="flex gap-2">
          <textarea
            id="problem-input"
            rows={3}
            value={problemInput}
            onChange={(e) => setProblemInput(e.target.value)}
            placeholder="e.g. Calculate the cardiac output if heart rate is 72 bpm and stroke volume is 70 ml. Or enter a monohybrid cross between heterozygous tall pea plants..."
            className="flex-1 bg-black/40 border border-wine-500/20 rounded-xl p-3.5 text-sm text-white placeholder-wine-300/30 focus:outline-none focus:border-wine-500/60 focus:ring-1 focus:ring-wine-500/60 transition-all font-sans resize-none"
          />
        </div>
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-wine-200/50">
            Tip: Press "Solve Step-by-Step" to break down given data, applicable ICSE theorem/formula, intermediate calculations, and final verified answers.
          </p>
          <button
            onClick={() => handleSolve()}
            disabled={loading || !problemInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-wine-600 to-indigo-600 hover:from-wine-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-wine-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Computing Steps...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Solve Step-by-Step</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Solution Display Area */}
      {solution && (
        <div className="space-y-6">
          {/* Section A: Problem Identification */}
          <div className="glass-card p-6 border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-500/40">
                  A
                </span>
                <h3 className="font-semibold text-white text-base">Problem Identification & Given Parameters</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {solution.topic}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-wine-300/70 font-semibold">Restatement of Problem:</span>
                <p className="text-sm text-wine-100/90 mt-1 italic bg-black/20 p-3 rounded-lg border border-white/5">
                  "{solution.original_problem}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/5">
                  <span className="text-xs font-semibold text-wine-300 uppercase tracking-wider block mb-2">
                    Given Values from Problem:
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(solution.given_values).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white/5">
                        <span className="text-wine-200/80 font-mono capitalize">{k.replace(/_/g, ' ')}:</span>
                        <span className="font-semibold text-white font-mono">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block mb-2">
                      Required Target Result:
                    </span>
                    <p className="text-sm font-medium text-white">
                      {solution.required_result}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-wine-200/60">Source Grounding:</span>
                    {onNavigateToPage && (
                      <button
                        onClick={() => onNavigateToPage(solution.source_page)}
                        className="text-wine-400 hover:text-wine-300 flex items-center gap-1 font-medium underline"
                      >
                        Revision Notes Page {solution.source_page}
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Concept Selection & Applicable Principles */}
          <div className="glass-card p-6 border-l-4 border-l-wine-500">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-wine-500/20 text-wine-400 flex items-center justify-center font-bold text-xs ring-1 ring-wine-500/40">
                  B
                </span>
                <h3 className="font-semibold text-white text-base">Concept Selection & Biological Principles</h3>
              </div>
              <span className="text-xs text-wine-300/80">ICSE Board Standard</span>
            </div>

            <p className="text-sm text-wine-100/90 leading-relaxed">
              {solution.concept_applied}
            </p>
          </div>

          {/* Section C: Step-by-Step Solution Breakdown */}
          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs ring-1 ring-emerald-500/40">
                  C
                </span>
                <h3 className="font-semibold text-white text-base">Step-by-Step Derivation & Intermediate Calculations</h3>
              </div>

              {/* View Mode Toggle: Step-by-Step vs Reveal All */}
              <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
                <button
                  onClick={() => setShowAllSteps(true)}
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    showAllSteps ? 'bg-emerald-600 text-white font-medium' : 'text-wine-200/60 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reveal All ({solution.steps.length})</span>
                </button>
                <button
                  onClick={() => {
                    setShowAllSteps(false);
                    setActiveStepIndex(0);
                  }}
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    !showAllSteps ? 'bg-emerald-600 text-white font-medium' : 'text-wine-200/60 hover:text-white'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Interactive Walkthrough</span>
                </button>
              </div>
            </div>

            {/* Steps Container */}
            <div className="space-y-4">
              {solution.steps.map((step, idx) => {
                const isVisible = showAllSteps || idx <= activeStepIndex;
                const isCurrent = !showAllSteps && idx === activeStepIndex;

                if (!isVisible) return null;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent 
                        ? 'bg-emerald-950/30 border-emerald-500/50 ring-1 ring-emerald-500/30' 
                        : 'bg-black/30 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Step {step.step_number}
                        </span>
                        <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>

                    <p className="text-sm text-wine-100/80 mb-3 whitespace-pre-line leading-relaxed">
                      {step.explanation}
                    </p>

                    {step.math_formula && (
                      <div className="bg-black/50 p-3 rounded-lg border border-white/5 my-2">
                        <span className="text-[11px] font-mono text-wine-300/60 block mb-1">Mathematical Formula:</span>
                        {renderKatex(step.math_formula)}
                      </div>
                    )}

                    {step.calculation && (
                      <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 font-mono text-xs text-emerald-300">
                        <span className="text-wine-300/60 mr-2">Calculation:</span>
                        {step.calculation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Walkthrough Controls when Interactive mode is selected */}
            {!showAllSteps && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setActiveStepIndex(0)}
                  className="text-xs text-wine-300/70 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Walkthrough</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-wine-300/70">
                    Step {activeStepIndex + 1} of {solution.steps.length}
                  </span>
                  {activeStepIndex < solution.steps.length - 1 ? (
                    <button
                      onClick={() => setActiveStepIndex((prev) => Math.min(prev + 1, solution.steps.length - 1))}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1 shadow-md shadow-emerald-950/40"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      All Steps Completed
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section D: Final Result & Verification */}
          <div className="glass-card p-6 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-950/20 via-black/40 to-transparent">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs ring-1 ring-amber-500/40">
                  D
                </span>
                <h3 className="font-semibold text-white text-base">Final Verified Result</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                Verified with ICSE Standards
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-amber-500/30 text-center my-3">
              <span className="text-xs font-mono text-amber-300/80 uppercase tracking-widest block mb-1">
                Final Calculated Answer:
              </span>
              <div className="text-2xl font-bold text-white tracking-wide font-mono text-amber-200">
                {solution.final_result}
              </div>
            </div>

            <div className="mt-3 flex items-start gap-2 text-xs text-wine-200/80 bg-black/30 p-3 rounded-lg border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Dimensional & Physiological Consistency Check: </span>
                {solution.verification_check}
              </div>
            </div>
          </div>

          {/* Section E: Learning Support, Pitfalls & Practice Hint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Common Mistakes */}
            <div className="glass-card p-5 border-l-4 border-l-rose-500">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h4 className="text-sm font-bold text-white">Common Student Examination Mistakes</h4>
              </div>
              <ul className="space-y-2 text-xs text-wine-100/80">
                {solution.common_mistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2 bg-rose-950/20 p-2 rounded border border-rose-500/10">
                    <span className="text-rose-400 font-bold shrink-0">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practice Hint & Next Problem */}
            <div className="glass-card p-5 border-l-4 border-l-indigo-500 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-sm font-bold text-white">Self-Practice Challenge</h4>
                  </div>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-indigo-300 hover:text-indigo-200 underline font-medium"
                  >
                    {showHint ? "Hide Hint" : "Reveal Hint"}
                  </button>
                </div>
                <p className="text-xs text-wine-200/80 leading-relaxed mb-3">
                  Try solving a variation with altered parameters to master this problem type for your ICSE Board exams!
                </p>

                {showHint && (
                  <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 animate-fade-in">
                    <span className="font-semibold text-white block mb-1">Board Exam Tip:</span>
                    {solution.similar_practice_hint}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-wine-300/60">Ready to test yourself under exam conditions?</span>
                <button
                  onClick={() => onNavigateToPage?.(solution.source_page)}
                  className="text-xs font-semibold text-wine-400 hover:text-wine-300 flex items-center gap-1"
                >
                  <span>Review Page {solution.source_page}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
