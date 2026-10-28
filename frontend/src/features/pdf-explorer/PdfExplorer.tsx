import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Bookmark, BookmarkCheck,
  Copy, Sparkles, ZoomIn, ZoomOut,
  Eye, FileText, Check
} from 'lucide-react';
import type { ChapterItem, BookmarkItem } from '../../types';
import { fetchPageData, getPageImageUrl } from '../../services/api';

interface PdfExplorerProps {
  chapters: ChapterItem[];
  initialPage?: number;
  onAddBookmark: (page: number, title: string, chapter: string, note?: string) => void;
  bookmarks: BookmarkItem[];
  onAskAiAboutPage: (pageText: string, pageNum: number) => void;
}

export const PdfExplorer: React.FC<PdfExplorerProps> = ({
  chapters,
  initialPage = 1,
  onAddBookmark,
  bookmarks,
  onAskAiAboutPage
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<'split' | 'original' | 'student'>('split');
  const [pageData, setPageData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [personalNote, setPersonalNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    let isMounted = true;
    fetchPageData(currentPage).then((data) => {
      if (isMounted) setPageData(data);
    });
    return () => { isMounted = false; };
  }, [currentPage]);

  const isBookmarked = bookmarks.some((b) => b.page === currentPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < 33) setCurrentPage(currentPage + 1);
  };

  const handleCopyExplanation = () => {
    if (pageData?.text) {
      navigator.clipboard.writeText(pageData.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveNote = () => {
    if (personalNote.trim()) {
      onAddBookmark(
        currentPage,
        `Notes on Page ${currentPage}`,
        pageData?.chapter || 'Biology',
        personalNote
      );
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    }
  };

  const currentChapter = chapters.find(
    (c) => currentPage >= c.page_start && currentPage <= c.page_end
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-wine-500/20">
        {/* Page Nav */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 text-white transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 font-mono text-sm">
            <span className="font-bold text-white">Page {currentPage}</span>
            <span className="text-slate-400">/ 33</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= 33}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 text-white transition-all"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {currentChapter && (
            <span className="hidden sm:inline-block ml-3 px-3 py-1 rounded-full bg-wine-500/20 text-wine-300 border border-wine-500/30 text-xs font-medium">
              Unit {currentChapter.number}: {currentChapter.title}
            </span>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-wine-500/20">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'split' ? 'bg-wine-600 text-white shadow-wine-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'original' ? 'bg-wine-600 text-white shadow-wine-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Original Page
          </button>
          <button
            onClick={() => setViewMode('student')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'student' ? 'bg-wine-600 text-white shadow-wine-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Explained View
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddBookmark(currentPage, `Page ${currentPage}`, currentChapter?.title || 'Biology')}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-wine-600 text-white border-wine-500'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title={isBookmarked ? "Bookmarked" : "Bookmark this page"}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onAskAiAboutPage(pageData?.text || '', currentPage)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-indigo-700 hover:from-wine-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-wine-glow transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Explain with AI</span>
          </button>
        </div>
      </div>

      {/* Main Exploration Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Original Scanned PDF Page */}
        {(viewMode === 'split' || viewMode === 'original') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} glass-card rounded-2xl p-4 flex flex-col items-center border border-wine-500/20`}>
            <div className="w-full flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-wine-400" />
                Original Document Page (Rendered at High Resolution)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(Math.max(70, zoomLevel - 15))}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-400">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full max-h-[720px] overflow-auto rounded-xl bg-black/60 border border-white/10 flex justify-center p-2">
              <img
                src={getPageImageUrl(currentPage)}
                alt={`ICSE Biology Page ${currentPage}`}
                style={{ width: `${zoomLevel}%` }}
                className="rounded shadow-2xl transition-all duration-200 object-contain"
                loading="eager"
                onError={(e) => {
                  // Fallback placeholder if image API is unavailable
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Right Column: Student-Friendly Explanation & Extracted Insights */}
        {(viewMode === 'split' || viewMode === 'student') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-5`}>
            {/* Extracted Structured Text Card */}
            <div className="glass-card rounded-2xl p-6 border border-wine-500/20">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-wine-500/15">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-wine-400" />
                  <h3 className="font-heading font-bold text-base text-white">
                    Student-Friendly Explanation & OCR Text
                  </h3>
                </div>
                <button
                  onClick={handleCopyExplanation}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {pageData?.text ? (
                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto pr-2">
                  {pageData.text}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm">
                  Loading and parsing text for Page {currentPage}...
                </div>
              )}

              {/* Key Terms Detected */}
              {pageData?.key_terms && pageData.key_terms.length > 0 && (
                <div className="mt-5 pt-4 border-t border-wine-500/15">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Key Biological Terms on this Page:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pageData.key_terms.map((term: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-wine-500/15 text-wine-300 border border-wine-500/25 font-mono"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagrams on this Page */}
              {pageData?.diagrams && pageData.diagrams.length > 0 && (
                <div className="mt-4 pt-4 border-t border-wine-500/15">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Official Board Diagrams on Page {currentPage}:
                  </span>
                  <div className="space-y-1.5">
                    {pageData.diagrams.map((d: string, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-wine-500/20 text-xs text-white flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Student Personal Study Note Editor */}
            <div className="glass-card rounded-2xl p-5 border border-wine-500/20">
              <h4 className="font-heading font-bold text-sm text-white mb-2 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-wine-400" />
                <span>Add Personal Revision Note for Page {currentPage}</span>
              </h4>
              <textarea
                rows={3}
                placeholder="Type important reminders, formulas, or teacher tips for this page..."
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/5 border border-wine-500/25 focus:border-wine-500 focus:outline-none focus:ring-1 focus:ring-wine-500 text-white placeholder:text-slate-400 text-xs transition-all resize-none mb-3"
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Notes are saved locally.</span>
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 rounded-xl bg-wine-600 hover:bg-wine-500 text-white text-xs font-semibold shadow-wine-glow transition-all"
                >
                  {noteSaved ? "Saved!" : "Save Note"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
