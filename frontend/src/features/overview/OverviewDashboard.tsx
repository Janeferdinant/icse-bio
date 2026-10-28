import React from 'react';
import { 
  Play, BookOpen, Layers, Award, Flame, ArrowRight, 
  Sparkles, CheckCircle2, Box
} from 'lucide-react';
import type { CourseOverview, NavigationTab } from '../../types';

interface OverviewDashboardProps {
  overview: CourseOverview;
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectChapter: (chapterId: number) => void;
  onOpen3dDemo: (demoId: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  overview,
  onNavigateTab,
  onSelectChapter,
  onOpen3dDemo
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-card p-6 md:p-8 bg-gradient-to-r from-wine-950/80 via-burgundy-950/70 to-indigo-950/80 border border-wine-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-wine-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wine-500/20 text-wine-300 text-xs font-semibold mb-4 border border-wine-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded in Uploaded ICSE Biology PDF</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-black text-white tracking-tight mb-3">
              Master ICSE Class 10 Biology with Interactive 3D Models
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
              Explore 14 curriculum chapters with real-time 3D demonstrations, step-by-step genetics & numerical solvers, and strictly grounded answers with original PDF citations.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('3d-demos')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-wine-600 to-indigo-600 hover:from-wine-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-wine-glow transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch 3D Demonstrations</span>
              </button>
              <button
                onClick={() => onNavigateTab('pdf-explorer')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/10 transition-all"
              >
                <BookOpen className="w-4 h-4 text-wine-400" />
                <span>Explore Original PDF</span>
              </button>
            </div>
          </div>

          {/* Quick Learning Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full lg:w-80 flex-shrink-0">
            <div className="p-4 rounded-2xl bg-black/40 border border-wine-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Chapters</span>
                <Layers className="w-4 h-4 text-wine-400" />
              </div>
              <div className="text-2xl font-black text-white">{overview.total_units}</div>
              <div className="text-[11px] text-wine-300">100% Extracted</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-wine-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Topics</span>
                <Award className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">{overview.total_topics}</div>
              <div className="text-[11px] text-indigo-300">Detailed notes</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-wine-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Syllabus</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">65%</div>
              <div className="text-[11px] text-emerald-300">9 Units Mastered</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-wine-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Avg Score</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">84%</div>
              <div className="text-[11px] text-amber-300">Board Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured 3D Demonstrations Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-heading font-bold text-white tracking-tight">
              Featured 3D Demonstration Laboratories
            </h3>
            <p className="text-xs text-slate-400">
              Interactive physical models rendered in WebGL with real-time biological controls
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('3d-demos')}
            className="text-xs font-semibold text-wine-400 hover:text-wine-300 flex items-center gap-1 transition-colors"
          >
            <span>View All 6 Labs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Demo 1: Human Heart */}
          <div className="glass-card rounded-2xl overflow-hidden p-5 flex flex-col justify-between group">
            <div>
              <div className="h-36 rounded-xl bg-gradient-to-br from-red-950/80 via-wine-950/60 to-slate-900 border border-red-500/20 flex items-center justify-center relative mb-4 overflow-hidden">
                <Box className="w-12 h-12 text-red-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-200 border border-red-500/30 font-mono">
                  3D Heart Model
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-white mb-1.5">
                Human Heart & Double Circulation
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Rotate 4 chambers, watch simulated blood flow particles, toggle tricuspid/bicuspid valves, and adjust heart rate (bpm).
              </p>
            </div>
            <button
              onClick={() => {
                onOpen3dDemo('human_heart');
                onNavigateTab('3d-demos');
              }}
              className="w-full py-2.5 rounded-xl bg-wine-600/30 hover:bg-wine-600 text-white text-xs font-semibold border border-wine-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Explore 3D Heart</span>
            </button>
          </div>

          {/* Demo 2: Nephron Ultrafiltration */}
          <div className="glass-card rounded-2xl overflow-hidden p-5 flex flex-col justify-between group">
            <div>
              <div className="h-36 rounded-xl bg-gradient-to-br from-indigo-950/80 via-blue-950/60 to-slate-900 border border-indigo-500/20 flex items-center justify-center relative mb-4 overflow-hidden">
                <Box className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 font-mono">
                  3D Nephron Model
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-white mb-1.5">
                Nephron & Glomerular Ultrafiltration
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Inspect Bowman's capsule, afferent vs efferent arteriole diameters, Net Filtration Pressure (10 mmHg), and ADH water reabsorption.
              </p>
            </div>
            <button
              onClick={() => {
                onOpen3dDemo('nephron_filtration');
                onNavigateTab('3d-demos');
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-white text-xs font-semibold border border-indigo-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Explore 3D Nephron</span>
            </button>
          </div>

          {/* Demo 3: Eye Optics & Defects */}
          <div className="glass-card rounded-2xl overflow-hidden p-5 flex flex-col justify-between group">
            <div>
              <div className="h-36 rounded-xl bg-gradient-to-br from-purple-950/80 via-wine-950/60 to-slate-900 border border-purple-500/20 flex items-center justify-center relative mb-4 overflow-hidden">
                <Box className="w-12 h-12 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30 font-mono">
                  3D Eye Optics
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-white mb-1.5">
                Eye Optics & Vision Defect Simulator
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Interactive eyeball focal length simulator. Toggle Myopia vs Hyperopia and observe how concave and convex lenses restore sharp vision.
              </p>
            </div>
            <button
              onClick={() => {
                onOpen3dDemo('eye_defect');
                onNavigateTab('3d-demos');
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-white text-xs font-semibold border border-purple-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Explore 3D Eye</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Yield Formulas & Exam Board Constants */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-heading font-bold text-white tracking-tight">
            High-Yield Formulas & Board Exam Principles
          </h3>
          <button
            onClick={() => onNavigateTab('step-solutions')}
            className="text-xs font-semibold text-wine-400 hover:text-wine-300 flex items-center gap-1"
          >
            <span>Open Problem Solver</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-xl border border-wine-500/20">
            <span className="text-[10px] font-mono text-wine-400 uppercase tracking-wider">Circulatory System</span>
            <div className="text-sm font-bold text-white mt-1 mb-1">Cardiac Output</div>
            <div className="p-2 rounded bg-black/40 font-mono text-xs text-wine-200 border border-wine-500/20 mb-2">
              CO = SV (70 ml) × HR (72) = 5040 ml/min
            </div>
            <p className="text-[11px] text-slate-400">Page 13 • Amount of blood ejected by each ventricle per minute.</p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-wine-500/20">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">Excretory System</span>
            <div className="text-sm font-bold text-white mt-1 mb-1">Net Filtration Pressure</div>
            <div className="p-2 rounded bg-black/40 font-mono text-xs text-indigo-200 border border-indigo-500/20 mb-2">
              NFP = GHP(55) - [BOP(30) + CHP(15)] = 10 mm Hg
            </div>
            <p className="text-[11px] text-slate-400">Page 15 • Net pressure driving ultrafiltration in glomerulus.</p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-wine-500/20">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">Genetics</span>
            <div className="text-sm font-bold text-white mt-1 mb-1">Mendelian Monohybrid Ratio</div>
            <div className="p-2 rounded bg-black/40 font-mono text-xs text-purple-200 border border-purple-500/20 mb-2">
              Phenotypic: 3:1 | Genotypic: 1:2:1
            </div>
            <p className="text-[11px] text-slate-400">Page 3 • Cross between homozygous Tall (TT) and Dwarf (tt).</p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-wine-500/20">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Photosynthesis</span>
            <div className="text-sm font-bold text-white mt-1 mb-1">Balanced Equation</div>
            <div className="p-2 rounded bg-black/40 font-mono text-xs text-emerald-200 border border-emerald-500/20 mb-2 truncate">
              6CO₂ + 12H₂O → C₆H₁₂O₆ + 6H₂O + 6O₂
            </div>
            <p className="text-[11px] text-slate-400">Page 8 • Requires sunlight and chlorophyll.</p>
          </div>
        </div>
      </div>

      {/* Chapters Overview List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-heading font-bold text-white tracking-tight">
            Curriculum Units & Extracted Syllabus
          </h3>
          <button
            onClick={() => onNavigateTab('units-topics')}
            className="text-xs font-semibold text-wine-400 hover:text-wine-300 flex items-center gap-1"
          >
            <span>View All Chapters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overview.chapters.slice(0, 6).map((chap) => (
            <div
              key={chap.id}
              onClick={() => {
                onSelectChapter(chap.id);
                onNavigateTab('units-topics');
              }}
              className="glass-card p-4 rounded-2xl cursor-pointer hover:border-wine-500/40 flex items-start justify-between gap-4 transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-wine-500/20 text-wine-300 font-semibold">
                    Unit {chap.number}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Pages {chap.page_start}-{chap.page_end}</span>
                  {chap.has_3d_demo && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      3D Lab
                    </span>
                  )}
                </div>
                <h4 className="font-heading font-bold text-sm text-white mb-1">{chap.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-2">{chap.summary}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-wine-400 flex-shrink-0 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
