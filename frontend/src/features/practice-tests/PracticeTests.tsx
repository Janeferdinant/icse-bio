import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Play, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  BookOpen, 
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { QuestionItem, Chapter, QuizAttempt } from '../../types';
import { fetchQuestionBank, fetchChapters } from '../../services/api';

interface PracticeTestsProps {
  onTestComplete?: (attempt: QuizAttempt) => void;
  onNavigateToPage?: (page: number) => void;
}

export const PracticeTests: React.FC<PracticeTestsProps> = ({ 
  onTestComplete,
  onNavigateToPage 
}) => {
  const [allQuestions, setAllQuestions] = useState<QuestionItem[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  // Configuration State
  const [testState, setTestState] = useState<'config' | 'in_progress' | 'completed'>('config');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(10);

  // Active Test State
  const [testQuestions, setTestQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedIndices, setFlaggedIndices] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [qData, cData] = await Promise.all([
          fetchQuestionBank(),
          fetchChapters()
        ]);
        setAllQuestions(qData);
        setChapters(cData);
      } catch (err) {
        console.error('Failed to load questions for test:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Timer Effect
  useEffect(() => {
    if (testState !== 'in_progress' || !isTimed) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpentSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [testState, isTimed]);

  const handleStartTest = () => {
    let pool = [...allQuestions];
    if (selectedUnit !== 'all') {
      pool = pool.filter(q => q.chapter_id === selectedUnit);
    }
    if (selectedDifficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === selectedDifficulty);
    }

    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    if (selected.length === 0) {
      alert("No questions match this selection. Please try selecting 'All Units' or 'All Difficulties'.");
      return;
    }

    setTestQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedIndices({});
    setSecondsRemaining(timeLimitMinutes * 60);
    setTimeSpentSeconds(0);
    setTestState('in_progress');
  };

  const handleSelectAnswer = (qId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const handleToggleFlag = (idx: number) => {
    setFlaggedIndices(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const calculateScore = () => {
    let score = 0;
    testQuestions.forEach(q => {
      const userAns = userAnswers[q.id]?.trim();
      const correctAns = q.correct_answer.trim();
      if (userAns && (userAns === correctAns || correctAns.startsWith(userAns) || userAns.includes(correctAns))) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmitTest = () => {
    setTestState('completed');
    const score = calculateScore();
    const total = testQuestions.length;
    const percentage = Math.round((score / total) * 100);

    if (percentage >= 70) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    if (onTestComplete) {
      const attempt: QuizAttempt = {
        id: `attempt_${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        chapter_id: selectedUnit === 'all' ? undefined : Number(selectedUnit),
        chapter_title: selectedUnit === 'all' ? 'Full Syllabus Mock' : `Unit ${selectedUnit}`,
        score,
        total,
        percentage,
        time_spent_seconds: timeSpentSeconds
      };
      onTestComplete(attempt);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-12 text-center glass-panel">
        <div className="w-8 h-8 border-2 border-wine-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-wine-200">Preparing examination simulator...</p>
      </div>
    );
  }

  // SCREEN 1: Test Configuration
  if (testState === 'config') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
        <div className="glass-panel p-8 border-l-4 border-l-wine-500 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-wine-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-wine-900/50 text-white">
            <Award className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ICSE Biology Practice & Mock Examination
          </h1>
          <p className="text-sm text-wine-200/70 max-w-xl mx-auto">
            Simulate ICSE Board paper conditions with timed evaluation, instantaneous grading, step-by-step ICSE marking explanations, and detailed error diagnostics.
          </p>
        </div>

        {/* Configuration Card */}
        <div className="glass-card p-6 space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-wine-300/80 pb-2 border-b border-white/5">
            Configure Your Test Session
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Unit Selector */}
            <div className="space-y-1.5">
              <label htmlFor="test-unit-select" className="text-xs font-medium text-white">Syllabus Scope / Unit:</label>
              <select
                id="test-unit-select"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full bg-black/40 border border-wine-500/20 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-wine-500/60"
              >
                <option value="all">Full Syllabus Mock Examination (All Units)</option>
                {chapters.map(chap => (
                  <option key={chap.id} value={chap.id}>
                    Unit {chap.id}: {chap.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label htmlFor="test-difficulty-select" className="text-xs font-medium text-white">Difficulty Level:</label>
              <select
                id="test-difficulty-select"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-black/40 border border-wine-500/20 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-wine-500/60"
              >
                <option value="all">Balanced ICSE Board Exam Pattern</option>
                <option value="easy">Easy (Definitions & Direct Terms)</option>
                <option value="medium">Medium (Processes & Schematics)</option>
                <option value="hard">Hard (Differences, Derivations & Genetics)</option>
              </select>
            </div>

            {/* Question Count */}
            <div className="space-y-1.5">
              <label htmlFor="test-count-select" className="text-xs font-medium text-white">Number of Questions:</label>
              <select
                id="test-count-select"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-black/40 border border-wine-500/20 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-wine-500/60"
              >
                <option value={5}>5 Questions (Quick Check ~ 5 mins)</option>
                <option value={10}>10 Questions (Standard Test ~ 10 mins)</option>
                <option value={15}>15 Questions (Intensive Test ~ 15 mins)</option>
                <option value={20}>20 Questions (Full Mock Paper ~ 25 mins)</option>
              </select>
            </div>

            {/* Timer Options */}
            <div className="space-y-1.5">
              <label htmlFor="test-duration-select" className="text-xs font-medium text-white">Examination Timing:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsTimed(true)}
                  className={`flex-1 p-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    isTimed 
                      ? 'bg-wine-600/30 border-wine-500 text-white' 
                      : 'bg-black/30 border-white/5 text-wine-200/60'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-wine-400" />
                  <span>Timed Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsTimed(false)}
                  className={`flex-1 p-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    !isTimed 
                      ? 'bg-wine-600/30 border-wine-500 text-white' 
                      : 'bg-black/30 border-white/5 text-wine-200/60'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Untimed Practice</span>
                </button>
              </div>
              {isTimed && (
                <div className="pt-2">
                  <select
                    id="test-duration-select"
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                    className="w-full bg-black/40 border border-wine-500/20 rounded-lg p-2 text-xs text-white"
                  >
                    <option value={5}>5 Minutes Time Limit</option>
                    <option value={10}>10 Minutes Time Limit</option>
                    <option value={15}>15 Minutes Time Limit</option>
                    <option value={30}>30 Minutes Time Limit</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-wine-300/60">
              Randomized from {allQuestions.length} verified ICSE board items
            </span>
            <button
              onClick={handleStartTest}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-wine-600 to-indigo-600 hover:from-wine-500 hover:to-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-wine-900/50 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Begin Examination</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 2: Active Test in Progress
  if (testState === 'in_progress') {
    const currentQ = testQuestions[currentIndex];
    const totalCount = testQuestions.length;
    const isFlagged = !!flaggedIndices[currentIndex];
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Top Control Bar */}
        <div className="glass-panel p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-white bg-wine-500/20 px-3 py-1 rounded-lg border border-wine-500/30">
              Question {currentIndex + 1} of {totalCount}
            </span>
            <span className="text-xs text-wine-300/70 hidden sm:inline">
              Unit {currentQ.chapter_id}: {currentQ.chapter_title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isTimed && (
              <div className={`flex items-center gap-1.5 font-mono text-sm px-3 py-1 rounded-lg border ${
                secondsRemaining <= 60 
                  ? 'bg-rose-950/50 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-black/40 border-white/10 text-wine-200'
              }`}>
                <Clock className="w-4 h-4 text-wine-400" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            )}

            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to finish and submit the test now?")) {
                  handleSubmitTest();
                }
              }}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              Finish Test
            </button>
          </div>
        </div>

        {/* Question Palette Drawer */}
        <div className="glass-panel p-3">
          <div className="flex items-center justify-between text-xs text-wine-300/70 mb-2">
            <span>Navigation Palette:</span>
            <span>{answeredCount} of {totalCount} Answered</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {testQuestions.map((q, idx) => {
              const answered = !!userAnswers[q.id];
              const flagged = !!flaggedIndices[idx];
              const isCurr = idx === currentIndex;

              let bg = "bg-black/40 text-wine-200/60 border-white/5";
              if (isCurr) bg = "ring-2 ring-wine-400 bg-wine-900/40 text-white font-bold";
              else if (flagged) bg = "bg-amber-500/20 text-amber-300 border-amber-500/40";
              else if (answered) bg = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium";

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg border text-xs flex items-center justify-center transition-all ${bg}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Question Card */}
        <div className="glass-card p-6 space-y-5 border-l-4 border-l-wine-500">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs px-2.5 py-0.5 rounded bg-wine-500/20 text-wine-300 border border-wine-500/30 uppercase tracking-wider font-semibold">
              {currentQ.question_type.replace(/_/g, ' ')}
            </span>
            <button
              onClick={() => handleToggleFlag(currentIndex)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg border transition-all ${
                isFlagged 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                  : 'bg-black/30 border-white/10 text-wine-300/70 hover:text-white'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
            </button>
          </div>

          <p className="text-base font-semibold text-white leading-relaxed">
            {currentQ.question}
          </p>

          {/* Options (MCQ) or Input Box */}
          {currentQ.options && currentQ.options.length > 0 ? (
            <div className="space-y-2 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx);
                const selected = userAnswers[currentQ.id] === opt;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(currentQ.id, opt)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-center gap-3 transition-all ${
                      selected 
                        ? 'bg-wine-600/30 border-wine-500 text-white ring-1 ring-wine-500' 
                        : 'bg-black/30 border-white/5 text-wine-100/80 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      selected ? 'bg-wine-500 text-white' : 'bg-white/10 text-white/70'
                    }`}>
                      {letter}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <label htmlFor="user-answer-input" className="text-xs text-wine-300/70 block">Write your answer below:</label>
              <textarea
                id="user-answer-input"
                rows={3}
                value={userAnswers[currentQ.id] || ''}
                onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                placeholder="Type your answer here as per ICSE marking scheme..."
                className="w-full bg-black/40 border border-wine-500/20 rounded-xl p-3 text-sm text-white placeholder-wine-300/30 focus:outline-none focus:border-wine-500/60"
              />
            </div>
          )}

          {/* Question Footer Navigation */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-xs text-wine-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < totalCount - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(totalCount - 1, prev + 1))}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-indigo-600 hover:from-wine-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
              >
                <span>Submit & Review Score</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 3: Test Completed & Review
  const score = calculateScore();
  const total = testQuestions.length;
  const percentage = Math.round((score / total) * 100);

  const filteredReviewQuestions = testQuestions.filter(q => {
    const userAns = userAnswers[q.id]?.trim();
    const correctAns = q.correct_answer.trim();
    const isCorrect = userAns && (userAns === correctAns || correctAns.startsWith(userAns) || userAns.includes(correctAns));
    if (reviewFilter === 'incorrect') return !isCorrect;
    if (reviewFilter === 'correct') return isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Score Card Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-emerald-500 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Exam Complete
            </span>
            <span className="text-xs text-wine-300/70">
              Time Spent: {Math.floor(timeSpentSeconds / 60)}m {timeSpentSeconds % 60}s
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Diagnostic Examination Report
          </h1>
          <p className="text-xs text-wine-200/70 mt-1">
            Review detailed answers, official ICSE explanations, and pinpoint the exact textbook pages for revision.
          </p>
        </div>

        {/* Score Ring / Pill */}
        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 shrink-0">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-white font-mono">
              {score} / {total}
            </div>
            <div className="text-xs text-wine-300/70 uppercase tracking-wider font-semibold">
              Score ({percentage}%)
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/40 flex items-center justify-center font-bold text-sm text-emerald-400">
            {percentage >= 80 ? 'A+' : percentage >= 60 ? 'B' : 'C'}
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter buttons */}
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setReviewFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              reviewFilter === 'all' ? 'bg-wine-600 text-white font-medium' : 'text-wine-200/60 hover:text-white'
            }`}
          >
            All Questions ({testQuestions.length})
          </button>
          <button
            onClick={() => setReviewFilter('incorrect')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              reviewFilter === 'incorrect' ? 'bg-rose-600 text-white font-medium' : 'text-wine-200/60 hover:text-white'
            }`}
          >
            Incorrect Only ({total - score})
          </button>
          <button
            onClick={() => setReviewFilter('correct')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              reviewFilter === 'correct' ? 'bg-emerald-600 text-white font-medium' : 'text-wine-200/60 hover:text-white'
            }`}
          >
            Correct Only ({score})
          </button>
        </div>

        {/* Retake and Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-xs text-wine-200 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-wine-400" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => setTestState('config')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-indigo-600 hover:from-wine-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Practice Session</span>
          </button>
        </div>
      </div>

      {/* Review Questions List */}
      <div className="space-y-4">
        {filteredReviewQuestions.map((q, idx) => {
          const userAns = userAnswers[q.id]?.trim();
          const correctAns = q.correct_answer.trim();
          const isCorrect = userAns && (userAns === correctAns || correctAns.startsWith(userAns) || userAns.includes(correctAns));

          return (
            <div
              key={q.id}
              className={`glass-card p-5 border-l-4 space-y-3 ${
                isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-wine-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                    Q{idx + 1}
                  </span>
                  <span className="text-xs font-medium text-white">
                    Unit {q.chapter_id}: {q.chapter_title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/30 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Correct [+1]
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-rose-400 font-bold bg-rose-950/30 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                      <XCircle className="w-3.5 h-3.5" />
                      Incorrect [0]
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm font-semibold text-white leading-relaxed">
                {q.question}
              </p>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className={`p-3 rounded-lg border ${
                  isCorrect 
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                }`}>
                  <span className="text-white/60 block mb-0.5 font-medium">Your Submitted Response:</span>
                  <span className="font-semibold">{userAns || "(No response recorded)"}</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                  <span className="text-white/60 block mb-0.5 font-medium">Official Correct Answer:</span>
                  <span className="font-semibold">{q.correct_answer}</span>
                </div>
              </div>

              {/* Explanation & PDF page grounding */}
              <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1.5 text-xs text-wine-100/80">
                <div className="font-medium text-wine-300">Explanation & Marking Rationale:</div>
                <p className="leading-relaxed">{q.explanation}</p>
                {onNavigateToPage && (
                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => onNavigateToPage(q.supporting_page)}
                      className="text-wine-400 hover:text-wine-300 font-medium flex items-center gap-1 underline text-[11px]"
                    >
                      <span>Review in Revision Notes (Page {q.supporting_page})</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
