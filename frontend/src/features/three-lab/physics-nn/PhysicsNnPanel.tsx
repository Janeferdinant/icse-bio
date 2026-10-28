import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, 
  BrainCircuit, Zap, Activity, Info, ChevronRight
} from 'lucide-react';
import type { PinnEvaluation } from './types';
import { globalVoiceNarrator, type VoiceNarratorState } from '../audio/voiceNarrator';
import { BIO_SCRIPTS } from '../audio/scriptData';

interface PhysicsNnPanelProps {
  demoId: string;
  evaluation: PinnEvaluation;
  selectedComponent?: string | null;
  onSelectComponent?: (comp: string) => void;
}

export const PhysicsNnPanel: React.FC<PhysicsNnPanelProps> = ({
  demoId,
  evaluation,
  selectedComponent,
  onSelectComponent
}) => {
  const [voiceState, setVoiceState] = useState<VoiceNarratorState>(
    globalVoiceNarrator.getState()
  );
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showFormulas, setShowFormulas] = useState<boolean>(false);

  const currentScript = BIO_SCRIPTS[demoId] || BIO_SCRIPTS.stomata_turgor;

  useEffect(() => {
    const unsubscribe = globalVoiceNarrator.subscribe((state) => {
      setVoiceState(state);
    });
    return () => {
      unsubscribe();
      globalVoiceNarrator.stop();
    };
  }, []);

  const handlePlayNarrator = () => {
    if (voiceState.isPaused) {
      globalVoiceNarrator.resume();
      return;
    }
    const fullSpeech = `${currentScript.intro} Here is an easy way to understand it: ${currentScript.kidAnalogy} And here is the science physics secret: ${currentScript.physicsExplanation}`;
    globalVoiceNarrator.speak(fullSpeech);
  };

  const handlePauseNarrator = () => {
    globalVoiceNarrator.pause();
  };

  const handleReplayNarrator = () => {
    handlePlayNarrator();
  };

  const handleSpeakComponent = (partName: string) => {
    onSelectComponent?.(partName);
    const fact = currentScript.funFacts[partName] || currentScript.componentDescriptions[partName];
    if (fact) {
      globalVoiceNarrator.speak(`${partName}! ${fact}`);
    }
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    globalVoiceNarrator.setRate(rate);
  };

  return (
    <div className="space-y-4">
      {/* 1. Dr. Bio Voice Guide Card */}
      <div className="glass-card p-4 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 to-slate-900/60 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <span className="text-xl">🎙️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-white text-sm tracking-wide">
                  Dr. Bio Audio Narrator
                </h3>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  5th Grade Guide
                </span>
              </div>
              <p className="text-xs text-rose-200/70">
                Natural speech voice-over & real-time physical analogies
              </p>
            </div>
          </div>

          {/* Voice Controls */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-rose-500/20">
            {voiceState.isSpeaking && !voiceState.isPaused ? (
              <button
                onClick={handlePauseNarrator}
                className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors"
                title="Pause voice"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePlayNarrator}
                className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors flex items-center gap-1 text-xs font-bold px-2.5"
                title="Play story narrator"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Listen</span>
              </button>
            )}

            <button
              onClick={handleReplayNarrator}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Restart story"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (!isMuted) {
                  globalVoiceNarrator.stop();
                  setIsMuted(true);
                } else {
                  setIsMuted(false);
                }
              }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Live Subtitle Caption Bar */}
        <div className="bg-black/60 rounded-xl p-3 border border-rose-500/20 mb-3 min-h-[58px] flex items-center justify-between gap-3">
          <div className="flex-1">
            <span className="text-[10px] font-bold text-rose-400 block mb-0.5 uppercase tracking-wider flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${voiceState.isSpeaking && !voiceState.isPaused ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              Live Transcript & Captions
            </span>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              {voiceState.currentText ? (
                `"${voiceState.currentText}"`
              ) : (
                <span className="text-slate-400 font-sans not-italic">
                  Click <strong>"Listen"</strong> above or tap any anatomical organ tag to hear Dr. Bio explain how it works!
                </span>
              )}
            </p>
          </div>

          {/* Speed Pills */}
          <div className="flex items-center gap-1 text-[10px]">
            {[0.8, 1.0, 1.2].map((rate) => (
              <button
                key={rate}
                onClick={() => handleRateChange(rate)}
                className={`px-1.5 py-0.5 rounded ${
                  speechRate === rate ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Kid Analogy Hook */}
        <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-3 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-300 block mb-0.5">5th-Grade Simple Analogy:</span>
            <p className="text-slate-300 leading-normal">{currentScript.kidAnalogy}</p>
          </div>
        </div>
      </div>

      {/* 2. Physics-Informed Neural Network (PINN) Engine Card */}
      <div className="glass-card p-4 rounded-2xl border border-sky-500/30 bg-gradient-to-br from-slate-900/90 to-sky-950/40 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-white text-sm tracking-wide flex items-center gap-1.5">
                <span>Physics Neural Network (PINN)</span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live 60fps
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                AI learning physical biological laws: Data Loss + Physics Residual
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowFormulas(!showFormulas)}
            className="text-[10px] px-2 py-1 rounded-lg border border-sky-500/30 text-sky-300 hover:bg-sky-500/10 transition-colors flex items-center gap-1"
          >
            <Info className="w-3 h-3" />
            <span>{showFormulas ? 'Simple View' : 'Formulas'}</span>
          </button>
        </div>

        {/* Neural Network Architecture Visualization (SVG diagram) */}
        <div className="bg-black/50 p-2.5 rounded-xl border border-sky-500/20 mb-3">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 px-1">
            <span>Input Parameters</span>
            <span>Hidden Physics Layers (16 Neurons)</span>
            <span>Biological Predictions</span>
          </div>

          <svg viewBox="0 0 320 65" className="w-full h-16">
            {/* Connections with dynamic stroke based on activeWeights */}
            {evaluation.activeWeights.map((row, rIdx) => 
              row.map((weight, wIdx) => {
                const x1 = 30;
                const y1 = 12 + rIdx * 14;
                const x2 = 160;
                const y2 = 8 + (rIdx * 3 + wIdx) * 4.5;
                const x3 = 290;
                const y3 = 14 + (wIdx * 16);
                const opacity = Math.min(0.9, Math.max(0.15, Math.abs(weight)));
                return (
                  <g key={`${rIdx}-${wIdx}`}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth="1" strokeOpacity={opacity} />
                    <line x1={x2} y1={y2} x2={x3} y2={y3} stroke="#a855f7" strokeWidth="1" strokeOpacity={opacity} />
                  </g>
                );
              })
            )}

            {/* Input Nodes */}
            {[0, 1, 2].map((idx) => (
              <circle key={`in-${idx}`} cx="30" cy={16 + idx * 17} r="5" fill="#38bdf8" className="animate-pulse" />
            ))}

            {/* Hidden Nodes */}
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <circle key={`hid-${idx}`} cx="160" cy={8 + idx * 9.5} r="4" fill="#a855f7" opacity="0.85" />
            ))}

            {/* Output Nodes */}
            {[0, 1, 2].map((idx) => (
              <circle key={`out-${idx}`} cx="290" cy={16 + idx * 17} r="5" fill="#10b981" />
            ))}
          </svg>
        </div>

        {/* PINN Loss Metrics Row */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
          <div className="bg-black/40 p-2 rounded-xl border border-sky-500/20">
            <span className="text-[10px] text-slate-400 block mb-0.5">Data Loss (Empirical)</span>
            <span className="text-xs font-mono font-bold text-sky-300">
              {evaluation.dataLoss.toFixed(4)}
            </span>
          </div>

          <div className="bg-black/40 p-2 rounded-xl border border-purple-500/20">
            <span className="text-[10px] text-slate-400 block mb-0.5">Physics Loss (Residual)</span>
            <span className="text-xs font-mono font-bold text-purple-300 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              {evaluation.physicsLoss.toFixed(4)}
            </span>
          </div>

          <div className="bg-black/40 p-2 rounded-xl border border-emerald-500/20">
            <span className="text-[10px] text-slate-400 block mb-0.5">Total PINN Loss</span>
            <span className="text-xs font-mono font-bold text-emerald-300">
              {evaluation.totalLoss.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Live Predicted Values Grid */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Real-Time AI Output Predictions:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(evaluation.predictions).map(([key, val]) => {
              const meta = evaluation.predictionLabels[key] || {
                label: key,
                unit: '',
                formula: '',
                kidExplanation: ''
              };
              return (
                <div key={key} className="bg-black/40 p-2.5 rounded-xl border border-slate-800 hover:border-sky-500/40 transition-colors">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="text-xs font-medium text-slate-300">{meta.label}</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {val} <span className="text-[10px] text-slate-400 font-sans">{meta.unit}</span>
                    </span>
                  </div>
                  {showFormulas && meta.formula && (
                    <div className="text-[10px] font-mono text-purple-300 bg-purple-950/40 px-1.5 py-0.5 rounded my-1">
                      {meta.formula}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {meta.kidExplanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Interactive Component Explorer & Fun-Facts */}
      <div className="glass-card p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-slate-900/60 shadow-lg">
        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" />
          <span>Interactive Organ Tags (Click to Inspect & Listen)</span>
        </h4>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {Object.keys(currentScript.componentDescriptions).map((part) => {
            const isSelected = selectedComponent === part;
            return (
              <button
                key={part}
                onClick={() => handleSpeakComponent(part)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <span>{part}</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>
            );
          })}
        </div>

        {selectedComponent && currentScript.funFacts[selectedComponent] && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2">
            <span className="text-base">💡</span>
            <div>
              <strong className="text-amber-200 block mb-0.5">{selectedComponent} Fun Fact:</strong>
              <p className="text-slate-300">{currentScript.funFacts[selectedComponent]}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
