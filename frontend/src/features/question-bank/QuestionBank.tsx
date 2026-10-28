import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Search, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Bookmark, 
  ExternalLink,
  Copy, 
  Check, 
  Layers
} from 'lucide-react';
import type { QuestionItem, Chapter } from '../../types';
import { fetchQuestionBank, fetchChapters } from '../../services/api';

interface QuestionBankProps {
  onNavigateToPage?: (page: number) => void;
  onBookmarkQuestion?: (q: QuestionItem) => void;
  bookmarkedIds?: string[];
}

export const QuestionBank: React.FC<QuestionBankProps> = ({ 
  onNavigateToPage,
  onBookmarkQuestion,
  bookmarkedIds = []
}) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [qData, chapData] = await Promise.all([
          fetchQuestionBank(),
          fetchChapters()
        ]);
        setQuestions(qData);
        setChapters(chapData);
      } catch (err) {
        console.error('Error loading question bank:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleReveal = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const revealAll = (reveal: boolean) => {
    const next: Record<string, boolean> = {};
    filteredQuestions.forEach(q => {
      next[q.id] = reveal;
    });
    setRevealedAnswers(next);
  };

  const handleCopy = (q: QuestionItem) => {
    const text = `Question: ${q.question}\nCorrect Answer: ${q.correct_answer}\nExplanation: ${q.explanation}\nSource: ICSE Biology Notes (p. ${q.supporting_page})`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQuestions = questions.filter(q => {
    if (selectedChapter !== 'all' && q.chapter_id !== selectedChapter) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (selectedType !== 'all' && q.question_type !== selectedType) return false;
    if (searchQuery.trim()) {
      const qText = `${q.question} ${q.chapter_title} ${q.topic} ${q.correct_answer}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'easy':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Easy</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>;
      case 'hard':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Hard</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const formatted = type.replace(/_/g, ' ');
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-wine-500/10 text-wine-300 border border-wine-500/20 uppercase tracking-wider">
        {formatted}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-wine-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-wine-500/20 text-wine-400 ring-1 ring-wine-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Curated ICSE Question Bank
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-wine-500/20 text-wine-300 border border-wine-500/30 font-medium">
                  {questions.length} Verified Questions
                </span>
              </h1>
              <p className="text-sm text-wine-200/70 mt-0.5">
                Practice topic-wise board examination questions, multiple-choice questions, fill-in-the-blanks, and structural differentiations with source-grounded answers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => revealAll(true)}
            className="px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-xs text-wine-200 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-wine-400" />
            <span>Reveal All</span>
          </button>
          <button
            onClick={() => revealAll(false)}
            className="px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-xs text-wine-200 flex items-center gap-1.5 transition-colors"
          >
            <EyeOff className="w-3.5 h-3.5 text-wine-400" />
            <span>Hide All</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-wine-400/60" />
            <input
              type="text"
              placeholder="Search terms, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-wine-500/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-wine-300/40 focus:outline-none focus:border-wine-500/60"
            />
          </div>

          {/* Chapter Filter */}
          <div>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              aria-label="Filter by ICSE Unit or Chapter"
              className="w-full bg-black/40 border border-wine-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-wine-500/60"
            >
              <option value="all">All ICSE Units / Chapters ({chapters.length})</option>
              {chapters.map(chap => (
                <option key={chap.id} value={chap.id}>
                  Unit {chap.id}: {chap.title}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              aria-label="Filter by Question Difficulty"
              className="w-full bg-black/40 border border-wine-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-wine-500/60"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy (Definitions & Terms)</option>
              <option value="medium">Medium (Processes & Functions)</option>
              <option value="hard">Hard (Differences & Calculations)</option>
            </select>
          </div>

          {/* Question Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by Question Pattern"
              className="w-full bg-black/40 border border-wine-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-wine-500/60"
            >
              <option value="all">All Question Formats</option>
              <option value="mcq">Multiple Choice (MCQ)</option>
              <option value="fill_in_blank">Fill in the Blanks</option>
              <option value="give_reason">Give Scientific Reason</option>
              <option value="differentiate">Differentiate Between</option>
              <option value="diagram">Diagram-based Questions</option>
            </select>
          </div>
        </div>

        {/* Counter and Active Filter Tags */}
        <div className="flex items-center justify-between text-xs text-wine-200/60 pt-1">
          <span>Showing {filteredQuestions.length} of {questions.length} questions</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Verified Grounded in ICSE Revision Notes
            </span>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="p-12 text-center glass-panel">
          <div className="w-8 h-8 border-2 border-wine-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-wine-200">Loading ICSE question bank...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-12 text-center glass-panel">
          <HelpCircle className="w-10 h-10 text-wine-400/50 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-white">No questions matched the selected criteria</h3>
          <p className="text-xs text-wine-200/60 mt-1">Try resetting the chapter or difficulty filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const isRevealed = !!revealedAnswers[q.id];
            const isBookmarked = bookmarkedIds.includes(q.id);

            return (
              <div 
                key={q.id}
                className="glass-card p-5 border border-white/5 hover:border-wine-500/30 transition-all space-y-3 relative group"
              >
                {/* Question Metadata Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-wine-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-medium text-white/90">
                      Unit {q.chapter_id}: {q.chapter_title}
                    </span>
                    <span className="text-wine-400/40">•</span>
                    <span className="text-xs text-wine-300/70">{q.topic}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getTypeBadge(q.question_type)}
                    {getDifficultyBadge(q.difficulty)}
                    <span className="text-[11px] font-mono text-wine-300/80 bg-white/5 px-1.5 py-0.5 rounded">
                      [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                    </span>
                  </div>
                </div>

                {/* Question Statement */}
                <p className="text-sm font-medium text-white leading-relaxed">
                  {q.question}
                </p>

                {/* MCQ Options if available */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isCorrect = isRevealed && (opt.startsWith(q.correct_answer) || q.correct_answer.includes(opt));
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 transition-all ${
                            isCorrect 
                              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold'
                              : 'bg-black/30 border-white/5 text-wine-100/80'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            isCorrect ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'
                          }`}>
                            {letter}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Answer Reveal Section */}
                {isRevealed && (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 animate-fade-in mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle className="w-4 h-4" />
                        <span>Official ICSE Answer:</span>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-300">Full Marks Scheme</span>
                    </div>

                    <div className="text-sm font-semibold text-white pl-5">
                      {q.correct_answer}
                    </div>

                    <div className="text-xs text-wine-100/80 pl-5 pt-1 border-t border-emerald-500/10">
                      <span className="text-emerald-300/80 font-medium">ICSE Marking Rationale: </span>
                      {q.explanation}
                    </div>
                  </div>
                )}

                {/* Question Card Footer Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleReveal(q.id)}
                      className="px-3 py-1.5 rounded-lg bg-wine-500/10 hover:bg-wine-500/20 border border-wine-500/30 text-wine-200 font-medium flex items-center gap-1.5 transition-colors"
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide Solution</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Show Solution</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(q)}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-wine-300 hover:text-white transition-colors"
                      title="Copy Question & Answer"
                    >
                      {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {onBookmarkQuestion && (
                      <button
                        onClick={() => onBookmarkQuestion(q)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isBookmarked 
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                            : 'bg-black/40 hover:bg-black/60 border-white/10 text-wine-300 hover:text-white'
                        }`}
                        title={isBookmarked ? "Bookmarked" : "Bookmark this question"}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-wine-300/60 text-[11px]">
                      Source Grounding:
                    </span>
                    {onNavigateToPage && (
                      <button
                        onClick={() => onNavigateToPage(q.supporting_page)}
                        className="text-wine-400 hover:text-wine-300 font-medium flex items-center gap-1 underline"
                      >
                        <span>Revision Notes p. {q.supporting_page}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
