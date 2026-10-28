import React from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Award, 
  BookOpen, 
  ArrowRight, 
  Target, 
  Sparkles
} from 'lucide-react';
import type { QuizAttempt, BookmarkItem, StudyNote } from '../../types';

interface AnalyticsDashboardProps {
  attempts: QuizAttempt[];
  bookmarks: BookmarkItem[];
  notes: StudyNote[];
  totalTopics: number;
  completedTopicIds: string[];
  onStartPractice?: () => void;
  onNavigateToTopic?: (chapterId: number) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  attempts = [],
  bookmarks = [],
  notes = [],
  totalTopics = 42,
  completedTopicIds = [],
  onStartPractice,
  onNavigateToTopic
}) => {
  // Aggregate Metrics
  const totalQuestionsAttempted = attempts.reduce((acc, a) => acc + a.total, 0);
  const totalQuestionsCorrect = attempts.reduce((acc, a) => acc + a.score, 0);
  const totalSecondsSpent = attempts.reduce((acc, a) => acc + a.time_spent_seconds, 0);
  const averageAccuracy = totalQuestionsAttempted > 0 
    ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100) 
    : 0;

  // Chapter-wise performance mapping
  const chapterStats: Record<string, { total: number; score: number; count: number }> = {};
  attempts.forEach(a => {
    const key = a.chapter_title;
    if (!chapterStats[key]) {
      chapterStats[key] = { total: 0, score: 0, count: 0 };
    }
    chapterStats[key].total += a.total;
    chapterStats[key].score += a.score;
    chapterStats[key].count += 1;
  });

  const unitPerformance = Object.entries(chapterStats).map(([title, stat]) => {
    const pct = Math.round((stat.score / stat.total) * 100);
    return { title, pct, total: stat.total, score: stat.score };
  });

  const strongUnits = unitPerformance.filter(u => u.pct >= 75);
  const weakUnits = unitPerformance.filter(u => u.pct < 75);

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m ${seconds % 60}s`;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="glass-panel p-6 border-l-4 border-l-wine-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-wine-500/20 text-wine-400 ring-1 ring-wine-500/30">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Learning Progress & Exam Analytics
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-wine-500/20 text-wine-300 border border-wine-500/30 font-medium">
                  Real-time Grounded Metrics
                </span>
              </h1>
              <p className="text-sm text-wine-200/70 mt-0.5">
                Track curriculum coverage, examination accuracy, weak topic diagnostics, and performance trends based on your actual activity.
              </p>
            </div>
          </div>
        </div>

        {attempts.length > 0 && onStartPractice && (
          <button
            onClick={onStartPractice}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-indigo-600 hover:from-wine-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all self-start md:self-auto"
          >
            <span>Take Another Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-card p-5 border-l-4 border-l-wine-500 space-y-2">
          <div className="flex items-center justify-between text-xs text-wine-300/80">
            <span>Overall Accuracy</span>
            <Target className="w-4 h-4 text-wine-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {attempts.length > 0 ? `${averageAccuracy}%` : '0%'}
          </div>
          <div className="text-[11px] text-wine-200/60 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{totalQuestionsCorrect} correct of {totalQuestionsAttempted} items</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-5 border-l-4 border-l-indigo-500 space-y-2">
          <div className="flex items-center justify-between text-xs text-indigo-300/80">
            <span>Practice Questions</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {totalQuestionsAttempted}
          </div>
          <div className="text-[11px] text-wine-200/60">
            Across {attempts.length} mock tests & quizzes
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-5 border-l-4 border-l-emerald-500 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-300/80">
            <span>Curriculum Progress</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {completedTopicIds.length} <span className="text-lg text-white/50">/ {totalTopics}</span>
          </div>
          <div className="text-[11px] text-wine-200/60">
            {Math.round((completedTopicIds.length / totalTopics) * 100)}% of ICSE Biology units explored
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card p-5 border-l-4 border-l-amber-500 space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-300/80">
            <span>Exam & Study Time</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {formatStudyTime(totalSecondsSpent)}
          </div>
          <div className="text-[11px] text-wine-200/60">
            {bookmarks.length} bookmarks, {notes.length} notes saved
          </div>
        </div>
      </div>

      {/* Empty State vs Real Analytics Data */}
      {attempts.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-wine-500/10 border border-wine-500/20 text-wine-400 flex items-center justify-center mx-auto">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">Genuine Empty State — No Activities Recorded Yet</h3>
            <p className="text-xs text-wine-200/70 leading-relaxed">
              In accordance with our strict data-grounding principles, we never fabricate learning history. Your score distributions, weak-topic diagnostics, and study recommendations will populate here automatically as you take practice tests and explore topics.
            </p>
          </div>
          {onStartPractice && (
            <button
              onClick={onStartPractice}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-wine-600 to-indigo-600 hover:from-wine-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Take Your First ICSE Practice Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Performance Diagnostics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unit Performance Breakdown */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-wine-300/80 flex items-center gap-2">
                <Target className="w-4 h-4 text-wine-400" />
                Unit-Wise Accuracy Breakdown
              </h3>

              <div className="space-y-3">
                {unitPerformance.map((u, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-white">{u.title}</span>
                      <span className="font-mono text-wine-300">{u.score}/{u.total} ({u.pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          u.pct >= 75 ? 'bg-emerald-500' : u.pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${u.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Recommendations */}
            <div className="glass-card p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-wine-300/80 flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-wine-400" />
                  Targeted Revision Recommendations
                </h3>

                <div className="space-y-3">
                  {weakUnits.length > 0 ? (
                    weakUnits.map((u, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <span className="font-semibold text-white block">Priority Revision: {u.title}</span>
                          <p className="text-wine-200/80">
                            Accuracy is at {u.pct}%. Review the core definitions, location & function charts, and attempt 5 practice questions for this unit.
                          </p>
                          {onNavigateToTopic && (
                            <button
                              onClick={() => onNavigateToTopic(i + 1)}
                              className="mt-1 text-[11px] text-rose-300 hover:text-white underline font-medium flex items-center gap-1"
                            >
                              <span>Explore Unit {i + 1}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200">
                      <span className="font-semibold text-white block mb-1">Excellent Progress!</span>
                      All tested units show mastery (&gt;= 75% accuracy). Consider taking a Full Syllabus Mock examination to test your retention under timer pressure.
                    </div>
                  )}

                  {strongUnits.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3">
                      <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <span className="font-semibold text-white block">Mastered Units:</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {strongUnits.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                              {s.title} ({s.pct}%)
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-xs text-wine-200/60">
                Grounding notice: Performance scores strictly reflect submitted answer sessions.
              </div>
            </div>
          </div>

          {/* Test Attempt History Log */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-wine-300/80 flex items-center gap-2">
              <Clock className="w-4 h-4 text-wine-400" />
              Examination History Log ({attempts.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-wine-300/60 uppercase tracking-wider font-mono">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Syllabus Scope</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Percentage</th>
                    <th className="pb-3 font-semibold">Time Elapsed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {attempts.map((att) => (
                    <tr key={att.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-white/80 font-mono">{att.date}</td>
                      <td className="py-3 font-medium text-white">{att.chapter_title}</td>
                      <td className="py-3 font-mono font-semibold text-white">
                        {att.score} / {att.total}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold font-mono ${
                          att.percentage >= 75 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : att.percentage >= 50
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {att.percentage}%
                        </span>
                      </td>
                      <td className="py-3 text-wine-200/70 font-mono">
                        {Math.floor(att.time_spent_seconds / 60)}m {att.time_spent_seconds % 60}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
