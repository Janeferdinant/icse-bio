import React, { useState } from 'react';
import { 
  Send, Sparkles, BookOpen, Copy, Check, 
  AlertCircle, ArrowRight
} from 'lucide-react';
import type { RAGResponse, NavigationTab } from '../../types';
import { askQuestion } from '../../services/api';

interface AiAssistantProps {
  initialQuery?: string;
  onJumpToPage: (page: number) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  initialQuery = '',
  onJumpToPage,
  onNavigateTab
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [style, setStyle] = useState<'simple' | 'detailed' | 'exam' | 'numerical' | 'practical' | 'revision'>('simple');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<RAGResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const suggestedQuestions = [
    "Why do cells divide and what is DNA overloading?",
    "Explain the stages of Mitosis with equatorial plate.",
    "Calculate the Cardiac Output with HR 75 and SV 70 ml.",
    "Explain ultrafiltration and Net Filtration Pressure in nephron.",
    "How is Myopia corrected using a concave lens?",
    "Why does the father determine child sex in humans?"
  ];

  const handleAsk = async (textToAsk?: string) => {
    const q = textToAsk || query;
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const res = await askQuestion(q.trim(), style);
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      const fullText = `${response.direct_answer}\n\n${response.detailed_explanation || ''}\n\nCitations: Page ${response.supporting_citations.map(c => c.page).join(', ')}`;
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="glass-card p-6 rounded-2xl border border-wine-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wine-500/20 text-wine-300 text-xs font-semibold mb-2 border border-wine-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Grounded in Uploaded PDF Coursework</span>
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-black text-white tracking-tight">
              PDF-Grounded AI Educational Assistant
            </h2>
            <p className="text-xs md:text-sm text-slate-300">
              Ask any question on ICSE Class 10 Biology. Every answer cites exact supporting pages and extracts verbatim evidence.
            </p>
          </div>

          {/* Response Style Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Style:</span>
            <div className="grid grid-cols-3 sm:flex flex-wrap gap-1 bg-black/40 p-1 rounded-xl border border-wine-500/20">
              {[
                { id: 'simple', label: 'Simple' },
                { id: 'detailed', label: 'Detailed' },
                { id: 'exam', label: 'Exam Mode' },
                { id: 'numerical', label: 'Numerical' },
                { id: 'practical', label: 'Practical' },
                { id: 'revision', label: 'Revision' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    style === s.id ? 'bg-wine-600 text-white shadow-wine-glow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="relative mt-2"
        >
          <input
            type="text"
            placeholder="Ask a concept, difference, formula derivation, or board exam question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-4 pr-24 py-3.5 rounded-xl bg-white/5 border border-wine-500/30 focus:border-wine-500 focus:outline-none focus:ring-1 focus:ring-wine-500 text-white placeholder:text-slate-400 text-sm transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-gradient-to-r from-wine-600 to-indigo-600 hover:from-wine-500 hover:to-indigo-500 text-white text-xs font-semibold disabled:opacity-40 shadow-wine-glow transition-all flex items-center gap-1.5"
          >
            {isLoading ? (
              <span className="animate-spin text-white">●</span>
            ) : (
              <>
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Suggested Queries Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-[11px] text-slate-400 font-semibold">Try asking:</span>
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(sq);
                handleAsk(sq);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-wine-500/20 text-slate-300 hover:text-wine-200 border border-white/5 hover:border-wine-500/30 transition-all text-left"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Response Display Card */}
      {response && (
        <div className="glass-card rounded-2xl p-6 border border-wine-500/30 space-y-6">
          {/* Header Status & Citations */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-wine-500/20">
            <div className="flex items-center gap-2">
              {response.is_grounded ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Verified Grounded in PDF</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Outside Provided PDF Scope</span>
                </span>
              )}
              <span className="text-xs text-slate-400 font-mono">
                Style: {response.style.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Section 1: Direct Answer */}
          <div>
            <h4 className="text-xs font-semibold text-wine-400 uppercase tracking-wider mb-2">
              1. Direct Answer
            </h4>
            <div className="p-4 rounded-xl bg-gradient-to-r from-wine-950/40 to-indigo-950/30 border border-wine-500/20 text-white text-sm md:text-base leading-relaxed font-medium">
              {response.direct_answer}
            </div>
          </div>

          {/* Section 2: Definition */}
          {response.definition && (
            <div>
              <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                2. Formal Definition / Key Concept
              </h4>
              <div className="p-3.5 rounded-xl bg-black/40 border border-indigo-500/20 text-slate-200 text-xs md:text-sm leading-relaxed">
                {response.definition}
              </div>
            </div>
          )}

          {/* Section 3: Detailed Explanation */}
          {response.detailed_explanation && (
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                3. Detailed Explanation & Mechanism
              </h4>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-black/20 p-4 rounded-xl border border-white/5">
                {response.detailed_explanation}
              </div>
            </div>
          )}

          {/* Section 4: Step-by-Step Reasoning */}
          {response.step_by_step && response.step_by_step.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                4. Step-by-Step Biological Progression
              </h4>
              <div className="space-y-2">
                {response.step_by_step.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold font-mono flex-shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Formula / Equation */}
          {response.formula && (
            <div>
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                5. Mathematical / Chemical Equation
              </h4>
              <div className="p-3 rounded-xl bg-black/50 font-mono text-emerald-300 text-xs md:text-sm border border-emerald-500/30">
                {response.formula}
              </div>
            </div>
          )}

          {/* Section 6: Exam Summary */}
          {response.exam_summary && (
            <div>
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                6. Exam-Oriented Summary & Keywords
              </h4>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs leading-relaxed">
                {response.exam_summary}
              </div>
            </div>
          )}

          {/* Section 7: Verifiable Source Citations */}
          {response.supporting_citations && response.supporting_citations.length > 0 && (
            <div className="pt-4 border-t border-wine-500/20">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-wine-400" />
                <span>Supporting PDF Passages & Page Citations:</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {response.supporting_citations.map((cite, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onJumpToPage(cite.page);
                      onNavigateTab('pdf-explorer');
                    }}
                    className="p-3 rounded-xl bg-black/40 border border-wine-500/20 hover:border-wine-500/50 cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-wine-300 font-mono">
                          Page {cite.page} • {cite.chapter}
                        </span>
                        <ArrowRight className="w-3 h-3 text-wine-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed italic">
                        "{cite.excerpt}"
                      </p>
                    </div>
                    <span className="text-[10px] text-wine-400 mt-2 block font-medium">
                      Click to jump to original PDF page →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Followups */}
          {response.suggested_followups && response.suggested_followups.length > 0 && (
            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Related Questions:</span>
              {response.suggested_followups.map((f, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(f);
                    handleAsk(f);
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-wine-500/20 text-slate-300 hover:text-white border border-white/10 transition-colors"
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
