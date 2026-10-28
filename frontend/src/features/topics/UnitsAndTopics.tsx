import React, { useState } from 'react';
import { 
  Search, BookOpen, Box, ArrowRight, ChevronDown, ChevronUp
} from 'lucide-react';
import type { ChapterItem, NavigationTab } from '../../types';

interface UnitsAndTopicsProps {
  chapters: ChapterItem[];
  selectedChapterId?: number;
  onNavigateTab: (tab: NavigationTab) => void;
  onJumpToPage: (page: number) => void;
  onOpen3dDemo: (demoId: string) => void;
}

export const UnitsAndTopics: React.FC<UnitsAndTopicsProps> = ({
  chapters,
  selectedChapterId,
  onNavigateTab,
  onJumpToPage,
  onOpen3dDemo
}) => {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(selectedChapterId || 1);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredChapters = chapters.filter((c) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      c.topics.some((t) => t.topic_name.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter and Search */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-wine-500/20">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">ICSE Biology Curriculum Topics</h3>
          <p className="text-xs text-slate-400">All 14 units extracted with definitions, formulas, and page coordinates</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-wine-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter units or topics..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/5 border border-wine-500/25 focus:border-wine-500 focus:outline-none text-white placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Chapters Accordion List */}
      <div className="space-y-4">
        {filteredChapters.map((chapter) => {
          const isExpanded = expandedChapter === chapter.id;
          return (
            <div
              key={chapter.id}
              className="glass-card rounded-2xl border border-wine-500/20 overflow-hidden transition-all duration-300"
            >
              {/* Chapter Header */}
              <div
                onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                className="p-5 flex items-start justify-between cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-wine-500/20 text-wine-300 flex items-center justify-center font-heading font-black text-sm border border-wine-500/30 flex-shrink-0">
                    {chapter.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-wine-400 font-mono font-semibold">
                        Pages {chapter.page_start} - {chapter.page_end}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/40 text-slate-300 border border-white/10">
                        {chapter.topics.length} Topics
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                        Weightage: ~{chapter.weightage_marks} Marks
                      </span>
                      {chapter.has_3d_demo && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                          3D Model Available
                        </span>
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-base md:text-lg text-white mb-1">
                      {chapter.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl line-clamp-2">
                      {chapter.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  {chapter.has_3d_demo && chapter.demo_id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen3dDemo(chapter.demo_id!);
                        onNavigateTab('3d-demos');
                      }}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-white text-xs font-semibold border border-indigo-500/40 transition-all shadow-indigo-glow"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>3D Demo</span>
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onJumpToPage(chapter.page_start);
                      onNavigateTab('pdf-explorer');
                    }}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-wine-600/30 hover:bg-wine-600 text-white text-xs font-semibold border border-wine-500/40 transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View in PDF</span>
                  </button>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-wine-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Subtopics Expansion */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-wine-500/15 space-y-3 bg-black/20">
                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Subtopics & Concept Breakdown:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {chapter.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="p-4 rounded-xl bg-white/5 border border-wine-500/20 hover:border-wine-500/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-white font-heading">
                              {topic.topic_name}
                            </span>
                            <button
                              onClick={() => {
                                onJumpToPage(topic.page_number);
                                onNavigateTab('pdf-explorer');
                              }}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-wine-500/20 text-wine-300 hover:bg-wine-500/30 transition-colors"
                            >
                              Page {topic.page_number}
                            </button>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed mb-3">
                            {topic.summary}
                          </p>

                          {topic.definitions && topic.definitions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {topic.definitions.map((def, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-wine-300 border border-wine-500/20"
                                >
                                  {def}
                                </span>
                              ))}
                            </div>
                          )}

                          {topic.formulas && topic.formulas.length > 0 && (
                            <div className="p-2 rounded bg-black/50 border border-indigo-500/20 font-mono text-[11px] text-indigo-300 mb-2">
                              {topic.formulas.join(' • ')}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between mt-2">
                          <button
                            onClick={() => {
                              onJumpToPage(topic.page_number);
                              onNavigateTab('pdf-explorer');
                            }}
                            className="text-xs text-wine-400 hover:text-wine-300 font-semibold flex items-center gap-1"
                          >
                            <span>Read page in PDF</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
