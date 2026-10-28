import React from 'react';
import { 
  LayoutDashboard, BookOpen, Layers, Box, Cpu, 
  MessageSquare, Calculator, Flame, Award, HelpCircle, 
  Bookmark, BarChart3, Settings, ChevronLeft, ChevronRight,
  Dna, Sparkles
} from 'lucide-react';
import type { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  totalChapters?: number;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  totalChapters = 14
}) => {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'pdf-explorer', label: 'PDF Explorer', icon: BookOpen, badge: 'Original' },
    { id: 'units-topics', label: 'Units & Topics', icon: Layers, badge: `${totalChapters}` },
    { id: '3d-demos', label: '3D Demonstrations', icon: Box, badge: 'Interactive' },
    { id: 'concept-viz', label: 'Concept Visualizations', icon: Cpu },
    { id: 'ask-questions', label: 'Ask Questions (RAG)', icon: MessageSquare, badge: 'Grounded' },
    { id: 'step-solutions', label: 'Step-by-Step Solutions', icon: Calculator },
    { id: 'numerical-problems', label: 'Numerical Problems', icon: Flame },
    { id: 'practice-tests', label: 'Practice Tests', icon: Award, badge: 'Exam' },
    { id: 'question-bank', label: 'Question Bank', icon: HelpCircle },
    { id: 'bookmarks-notes', label: 'Bookmarks & Notes', icon: Bookmark },
    { id: 'progress-analytics', label: 'Progress & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Upload', icon: Settings }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 flex flex-col glass-panel border-r border-wine-500/20 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-wine-500/15">
        <div className="flex items-center space-x-3 overflow-hidden cursor-pointer" onClick={() => onSelectTab('overview')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wine-600 via-wine-700 to-indigo-900 flex items-center justify-center shadow-wine-glow flex-shrink-0 text-white">
            <Dna className="w-5 h-5 animate-pulse" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <div className="font-heading font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>BioInteractive</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-wine-500/20 text-wine-300 font-mono border border-wine-500/30">ICSE</span>
              </div>
              <p className="text-xs text-wine-300/70 truncate">3D Learning Dashboard</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-wine-500/15 text-wine-300/80 hover:text-white transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all group relative text-left text-sm font-medium ${
                isActive
                  ? 'bg-gradient-to-r from-wine-600/30 to-indigo-600/20 text-white border border-wine-500/40 shadow-wine-glow'
                  : 'text-slate-300 hover:text-white hover:bg-wine-900/20'
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-wine-400' : 'text-slate-400 group-hover:text-wine-300'
                }`}
              />
              {!collapsed && (
                <span className="ml-3 truncate font-normal tracking-wide flex-1">
                  {item.label}
                </span>
              )}
              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ml-2 ${
                    isActive
                      ? 'bg-wine-500/40 text-wine-100 border border-wine-400/30'
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {collapsed && isActive && (
                <div className="absolute right-1 w-1.5 h-6 bg-wine-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-4 border-t border-wine-500/15 m-3 rounded-2xl bg-gradient-to-b from-wine-950/40 to-indigo-950/40 border border-wine-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-wine-400" />
            <span className="text-xs font-semibold text-white">ICSE Biology 2026</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            Grounded in official revision notes & board model test papers.
          </p>
          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-wine-500 to-indigo-500 h-full w-[65%]" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
            <span>Progress: 9/14 Chapters</span>
            <span className="font-semibold text-wine-300">65%</span>
          </div>
        </div>
      )}
    </aside>
  );
};
