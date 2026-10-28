import React, { useState } from 'react';
import { 
  Search, Sun, Moon, Upload, Flame 
} from 'lucide-react';
import type { NavigationTab } from '../types';

interface HeaderProps {
  currentTab: NavigationTab;
  onNavigateTab: (tab: NavigationTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenUploadModal: () => void;
  onGlobalSearch: (query: string) => void;
  courseTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigateTab,
  isDark,
  onToggleTheme,
  onOpenUploadModal,
  onGlobalSearch,
  courseTitle
}) => {
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onGlobalSearch(searchVal.trim());
      onNavigateTab('ask-questions');
    }
  };

  const tabLabels: Record<NavigationTab, string> = {
    'overview': 'Dashboard Overview',
    'pdf-explorer': 'Original PDF Explorer',
    'units-topics': 'Units & Course Topics',
    '3d-demos': 'Interactive 3D Demonstrations',
    'concept-viz': '2D Concept Visualizations',
    'ask-questions': 'Grounded AI Assistant',
    'step-solutions': 'Step-by-Step Problem Solver',
    'numerical-problems': 'Numerical & Genetics Workspace',
    'practice-tests': 'Practice & Examination Mode',
    'question-bank': 'Curated Question Bank',
    'bookmarks-notes': 'Bookmarks & Personal Notes',
    'progress-analytics': 'Learning Analytics & Mastery',
    'settings': 'Platform Settings & Documents'
  };

  return (
    <header className="h-20 sticky top-0 z-30 px-6 flex items-center justify-between glass-panel border-b border-wine-500/20">
      {/* Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-wine-400">
          <span>Course</span>
          <span>/</span>
          <span className="text-slate-400 truncate max-w-xs">{courseTitle}</span>
        </div>
        <h1 className="text-lg md:text-xl font-heading font-extrabold text-white tracking-tight">
          {tabLabels[currentTab]}
        </h1>
      </div>

      {/* Center Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-wine-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search concepts, formulas, or questions in PDF..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-white/5 border border-wine-500/25 focus:border-wine-500 focus:outline-none focus:ring-1 focus:ring-wine-500 text-white placeholder:text-slate-400 transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white/10 text-slate-300 px-1.5 py-0.5 rounded border border-white/10">
            Enter
          </kbd>
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Streak Counter */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-wine-950/50 border border-wine-500/30 text-xs">
          <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
          <span className="font-semibold text-white">4 Days Streak</span>
        </div>

        {/* Upload Button */}
        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-indigo-700 hover:from-wine-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-wine-glow transition-all active:scale-95"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload PDF</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-wine-500/20 text-wine-300 hover:text-white transition-all"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
