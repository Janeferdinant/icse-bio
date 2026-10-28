import React, { useState } from 'react';
import { 
  Settings, 
  Upload, 
  Key, 
  Sun, 
  Moon, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';
import { uploadPdfFile } from '../../services/api';

interface SettingsViewProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onClearData: () => void;
  onPdfUploaded?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  onToggleTheme,
  onClearData,
  onPdfUploaded
}) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('custom_gemini_api_key') || '');
  const [keySaved, setKeySaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSaveApiKey = () => {
    localStorage.setItem('custom_gemini_api_key', apiKey.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      setUploadStatus({ success: false, message: 'Only valid .pdf files are supported.' });
      return;
    }

    setUploading(true);
    setUploadStatus(null);
    try {
      const res = await uploadPdfFile(file);
      setUploadStatus({
        success: true,
        message: `Successfully processed "${res.filename}" (${res.total_pages} pages indexed with ${res.chapters_detected} units detected)!`
      });
      onPdfUploaded?.();
    } catch (err: any) {
      setUploadStatus({
        success: false,
        message: err.message || 'Failed to upload and process PDF file. Ensure backend is running.'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="glass-panel p-6 border-l-4 border-l-wine-500 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-wine-500/20 text-wine-400 ring-1 ring-wine-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              System Settings & Data Engine
            </h1>
            <p className="text-sm text-wine-200/70 mt-0.5">
              Configure PDF source uploads, LLM providers, user interface theme, and local cache.
            </p>
          </div>
        </div>
      </div>

      {/* 1. PDF Document Upload and Re-indexing */}
      <div className="glass-card p-6 space-y-4 border-l-4 border-l-indigo-500">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Upload & Index New Course PDF</h2>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            Dynamic Curriculum Adaptation
          </span>
        </div>

        <p className="text-xs text-wine-200/80 leading-relaxed">
          Upload any academic syllabus PDF or textbook notes. The system extracts chapters, builds vector embeddings, indexes diagrams & equations, and automatically populates the 3D dashboard.
        </p>

        <div className="p-6 rounded-2xl border-2 border-dashed border-wine-500/30 hover:border-wine-500/60 transition-colors bg-black/30 text-center space-y-3">
          <FileText className="w-10 h-10 text-wine-400/60 mx-auto" />
          <div>
            <label htmlFor="pdf-upload" className="cursor-pointer px-5 py-2.5 rounded-xl bg-wine-600 hover:bg-wine-500 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-md transition-all">
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing & OCR Indexing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Select Course PDF File</span>
                </>
              )}
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
          <p className="text-[11px] text-wine-300/50">
            Current Active Corpus: <span className="text-white font-medium">Biology - Revision Notes.pdf (33 pages, 14 units)</span>
          </p>
        </div>

        {uploadStatus && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 animate-fade-in ${
            uploadStatus.success 
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}>
            {uploadStatus.success ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{uploadStatus.message}</span>
          </div>
        )}
      </div>

      {/* 2. Replaceable LLM Integration */}
      <div className="glass-card p-6 space-y-4 border-l-4 border-l-wine-500">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-wine-400" />
            <h2 className="text-base font-bold text-white">Configurable LLM Provider</h2>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-wine-500/10 text-wine-300 border border-wine-500/20">
            Grounding Verified
          </span>
        </div>

        <p className="text-xs text-wine-200/80 leading-relaxed">
          The dashboard includes an integrated, zero-dependency offline TF-IDF vector retrieval engine for strict syllabus grounding. You can optionally connect your Google Gemini API key or a compatible OpenAI-format endpoint for enhanced synthesis.
        </p>

        <div className="space-y-2">
          <label htmlFor="api-key-input" className="text-xs font-semibold text-white flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-wine-400" />
            <span>Gemini API Key (Optional):</span>
          </label>
          <div className="flex gap-2">
            <input
              id="api-key-input"
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 bg-black/40 border border-wine-500/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-wine-300/30 focus:outline-none focus:border-wine-500/60 font-mono"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-4 py-2 rounded-xl bg-wine-600 hover:bg-wine-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{keySaved ? "Saved!" : "Save Key"}</span>
            </button>
          </div>
          <p className="text-[11px] text-wine-300/50 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Never exposed on public servers; stored strictly in local client memory.</span>
          </p>
        </div>
      </div>

      {/* 3. Appearance & Theme */}
      <div className="glass-card p-6 space-y-4 border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
            <h2 className="text-base font-bold text-white">Visual Theme & Interface Contrast</h2>
          </div>
          <span className="text-xs text-wine-300/70">WCAG AA Compliant</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">
              {theme === 'dark' ? "Academic Dark Glassmorphism" : "Academic Light High-Contrast"}
            </div>
            <p className="text-xs text-wine-200/60 mt-0.5">
              Optimized for low-strain night study sessions and vivid 3D WebGL rendering.
            </p>
          </div>
          <button
            onClick={onToggleTheme}
            className="px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-xs font-medium text-white flex items-center gap-2 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
      </div>

      {/* 4. Local Storage & Data Reset */}
      <div className="glass-card p-6 space-y-4 border-l-4 border-l-rose-500">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold text-white">Reset Local Learning Data</h2>
          </div>
          <span className="text-xs text-rose-400/80 font-medium">Irreversible</span>
        </div>

        <p className="text-xs text-wine-200/80 leading-relaxed">
          Clear all locally saved quiz attempts, study notes, bookmarked pages, and topic completion checkboxes. This resets your dashboard to a clean slate.
        </p>

        <div className="pt-2">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all test scores, notes, and bookmarks? This action cannot be undone.")) {
                onClearData();
                alert("All local activity history has been cleared.");
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset All Progress & Notes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
