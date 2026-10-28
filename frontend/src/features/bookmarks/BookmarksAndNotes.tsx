import React, { useState } from 'react';
import { 
  Bookmark, 
  FileText, 
  Search, 
  Trash2, 
  Plus, 
  ExternalLink, 
  Calendar, 
  Edit3, 
  Check
} from 'lucide-react';
import type { BookmarkItem, StudyNote, Chapter } from '../../types';

interface BookmarksAndNotesProps {
  bookmarks: BookmarkItem[];
  notes: StudyNote[];
  chapters: Chapter[];
  onDeleteBookmark: (id: string) => void;
  onAddNote: (note: StudyNote) => void;
  onDeleteNote: (id: string) => void;
  onNavigateToPage?: (page: number) => void;
}

export const BookmarksAndNotes: React.FC<BookmarksAndNotesProps> = ({
  bookmarks,
  notes,
  chapters,
  onDeleteBookmark,
  onAddNote,
  onDeleteNote,
  onNavigateToPage
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes'>('bookmarks');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Note Form State
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteChapter, setNoteChapter] = useState<string>(chapters[0]?.title || 'Cell Division');
  const [noteContent, setNoteContent] = useState('');

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    const newNote: StudyNote = {
      id: `note_${Date.now()}`,
      chapter_title: noteChapter,
      content: noteContent.trim(),
      created_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    onAddNote(newNote);
    setNoteContent('');
    setIsAddingNote(false);
  };

  const filteredBookmarks = bookmarks.filter(b => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.chapter.toLowerCase().includes(q) || b.note.toLowerCase().includes(q);
  });

  const filteredNotes = notes.filter(n => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return n.content.toLowerCase().includes(q) || n.chapter_title.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="glass-panel p-6 border-l-4 border-l-wine-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-wine-500/20 text-wine-400 ring-1 ring-wine-500/30">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Bookmarks & Personal Study Notes
              </h1>
              <p className="text-sm text-wine-200/70 mt-0.5">
                Organize your key textbook highlights, high-yield formulas, exam annotations, and personal study summaries.
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-wine-600 text-white font-medium shadow-md'
                : 'text-wine-200/60 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-wine-400" />
            <span>Bookmarks ({bookmarks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'notes'
                ? 'bg-wine-600 text-white font-medium shadow-md'
                : 'text-wine-200/60 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-wine-400" />
            <span>Study Notes ({notes.length})</span>
          </button>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-wine-400/60" />
          <input
            type="text"
            placeholder={activeTab === 'bookmarks' ? "Search bookmarks..." : "Search study notes..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-wine-500/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-wine-300/40 focus:outline-none focus:border-wine-500/60"
          />
        </div>

        {activeTab === 'notes' && (
          <button
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-indigo-600 hover:from-wine-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingNote ? "Cancel" : "Add New Note"}</span>
          </button>
        )}
      </div>

      {/* Note Creation Form Drawer */}
      {activeTab === 'notes' && isAddingNote && (
        <div className="glass-card p-5 border-l-4 border-l-indigo-500 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <span>Create Revision Note</span>
            </h3>
            <span className="text-xs text-wine-300/60">Saves locally to your browser</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label htmlFor="note-chapter-select" className="text-xs font-medium text-white">Select Unit / Chapter:</label>
              <select
                id="note-chapter-select"
                value={noteChapter}
                onChange={(e) => setNoteChapter(e.target.value)}
                className="w-full bg-black/40 border border-wine-500/20 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-wine-500/60"
              >
                {chapters.map(c => (
                  <option key={c.id} value={c.title}>
                    Unit {c.id}: {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="note-content-area" className="text-xs font-medium text-white">Key Takeaways & Formulas:</label>
              <textarea
                id="note-content-area"
                rows={3}
                placeholder="Write your personal observations, mnemonics, or tricky ICSE examination definitions..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full bg-black/40 border border-wine-500/20 rounded-xl p-3 text-xs text-white placeholder-wine-300/30 focus:outline-none focus:border-wine-500/60 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsAddingNote(false)}
              className="px-4 py-2 rounded-xl bg-black/40 text-xs text-wine-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              disabled={!noteContent.trim()}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: Bookmarks View */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3">
          {filteredBookmarks.length === 0 ? (
            <div className="p-12 text-center glass-panel">
              <Bookmark className="w-10 h-10 text-wine-400/40 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-white">No bookmarks saved yet</h3>
              <p className="text-xs text-wine-200/60 mt-1 max-w-md mx-auto">
                Bookmark important textbook pages while exploring the PDF Explorer, or click the bookmark icon on questions in the Question Bank.
              </p>
            </div>
          ) : (
            filteredBookmarks.map((b) => (
              <div 
                key={b.id}
                className="glass-card p-4 border border-white/5 hover:border-wine-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-wine-300 bg-wine-500/10 px-2 py-0.5 rounded border border-wine-500/20">
                      {b.chapter}
                    </span>
                    <span className="text-xs text-wine-200/50 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {b.created_at}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-wine-200 transition-colors">
                    {b.title}
                  </h4>
                  {b.note && (
                    <p className="text-xs text-wine-200/80 italic">"{b.note}"</p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                  {onNavigateToPage && (
                    <button
                      onClick={() => onNavigateToPage(b.page)}
                      className="px-3 py-1.5 rounded-lg bg-wine-600/30 hover:bg-wine-600/50 border border-wine-500/40 text-wine-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>Jump to Page {b.page}</span>
                      <ExternalLink className="w-3 h-3 text-wine-400" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteBookmark(b.id)}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-950/40 text-wine-400/60 hover:text-rose-400 border border-white/5 transition-colors"
                    title="Delete Bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Notes View */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="p-12 text-center glass-panel">
              <FileText className="w-10 h-10 text-indigo-400/40 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-white">No personal study notes recorded</h3>
              <p className="text-xs text-wine-200/60 mt-1 max-w-md mx-auto">
                Click "+ Add New Note" above or use the Notes section in the PDF Explorer to write quick summaries while reading.
              </p>
            </div>
          ) : (
            filteredNotes.map((n) => (
              <div 
                key={n.id}
                className="glass-card p-5 border-l-4 border-l-indigo-500 space-y-2 relative group"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {n.chapter_title}
                    </span>
                    <span className="text-xs text-wine-300/50 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {n.created_at}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteNote(n.id)}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-950/40 text-wine-400/60 hover:text-rose-400 border border-white/5 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-sm text-wine-100/90 leading-relaxed whitespace-pre-line pt-1">
                  {n.content}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
