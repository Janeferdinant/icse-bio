import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import type { NavigationTab, CourseOverview, ChapterItem, BookmarkItem, StudyNote, QuizAttempt, QuestionItem } from './types';
import { fetchCourseOverview, fetchChapters } from './services/api';

// Feature Views
import { OverviewDashboard } from './features/overview/OverviewDashboard';
import { PdfExplorer } from './features/pdf-explorer/PdfExplorer';
import { UnitsAndTopics } from './features/topics/UnitsAndTopics';
import { ThreeLab } from './features/three-lab/ThreeLab';
import { ConceptVisualizations } from './features/visualizations/ConceptVisualizations';
import { AiAssistant } from './features/ai-assistant/AiAssistant';
import { ProblemSolver } from './features/problem-solver/ProblemSolver';
import { PracticeTests } from './features/practice-tests/PracticeTests';
import { QuestionBank } from './features/question-bank/QuestionBank';
import { BookmarksAndNotes } from './features/bookmarks/BookmarksAndNotes';
import { AnalyticsDashboard } from './features/analytics/AnalyticsDashboard';
import { SettingsView } from './features/settings/SettingsView';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('app_theme') as 'dark' | 'light') || 'dark';
  });

  // Course Data
  const [overview, setOverview] = useState<CourseOverview | null>(null);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [, setLoading] = useState(true);

  // Cross-Navigation Parameters
  const [targetPage, setTargetPage] = useState<number>(1);
  const [targetDemoId, setTargetDemoId] = useState<string>('human_heart');
  const [targetChapterId, setTargetChapterId] = useState<number>(1);
  const [aiAssistantQuery, setAiAssistantQuery] = useState<string>('');

  // Persistent User Activity State
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('icse_bookmarks');
      return saved ? JSON.parse(saved) : [
        {
          id: 'b1',
          title: 'Structure of Human Heart & Valves',
          page: 17,
          chapter: 'Circulation & Heart',
          note: 'Key diagram for board exam: bicuspid vs tricuspid locations',
          created_at: 'Oct 25, 2026'
        },
        {
          id: 'b2',
          title: 'Ultrafiltration & Net Filtration Pressure Formula',
          page: 20,
          chapter: 'Excretory System',
          note: 'Formula: NFP = GHP - (BCOP + CHP) = 10 mmHg',
          created_at: 'Oct 25, 2026'
        }
      ];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    try {
      const saved = localStorage.getItem('icse_notes');
      return saved ? JSON.parse(saved) : [
        {
          id: 'n1',
          chapter_title: 'Excretory System',
          content: 'Glomerulus: Afferent arteriole is wider than efferent arteriole, creating high hydrostatic pressure (55 mmHg) essential for ultrafiltration.',
          created_at: 'Oct 25, 2026'
        }
      ];
    } catch {
      return [];
    }
  });

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    try {
      const saved = localStorage.getItem('icse_quiz_attempts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('icse_completed_topics');
      return saved ? JSON.parse(saved) : ['unit_1', 'unit_7', 'unit_8'];
    } catch {
      return [];
    }
  });

  // Sync theme with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Persist storage
  useEffect(() => {
    localStorage.setItem('icse_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('icse_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('icse_quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  useEffect(() => {
    localStorage.setItem('icse_completed_topics', JSON.stringify(completedTopicIds));
  }, [completedTopicIds]);

  // Fetch initial course structure
  const loadCourseData = async () => {
    setLoading(true);
    try {
      const [ovData, chData] = await Promise.all([
        fetchCourseOverview(),
        fetchChapters()
      ]);
      setOverview(ovData);
      setChapters(chData);
    } catch (err) {
      console.error('Failed to load course data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, []);

  // Navigation handlers
  const handleJumpToPage = (page: number) => {
    setTargetPage(page);
    setCurrentTab('pdf-explorer');
  };

  const handleOpen3dDemo = (demoId: string) => {
    setTargetDemoId(demoId);
    setCurrentTab('3d-demos');
  };

  const handleSelectChapter = (chapterId: number) => {
    setTargetChapterId(chapterId);
    setCurrentTab('units-topics');
  };

  const handleGlobalSearch = (query: string) => {
    setAiAssistantQuery(query);
    setCurrentTab('ask-questions');
  };

  const handleAddBookmark = (page: number, title: string, chapter: string, note?: string) => {
    const newBm: BookmarkItem = {
      id: `bm_${Date.now()}`,
      title,
      page,
      chapter,
      note: note || '',
      created_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setBookmarks(prev => [newBm, ...prev]);
  };

  const handleBookmarkQuestion = (q: QuestionItem) => {
    const exists = bookmarks.some(b => b.id === q.id);
    if (exists) {
      setBookmarks(prev => prev.filter(b => b.id !== q.id));
    } else {
      const newBm: BookmarkItem = {
        id: q.id,
        title: q.question,
        page: q.supporting_page,
        chapter: `Unit ${q.chapter_id}: ${q.chapter_title}`,
        note: `Answer: ${q.correct_answer}`,
        created_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setBookmarks(prev => [newBm, ...prev]);
    }
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleAddNote = (newNote: StudyNote) => {
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleQuizComplete = (attempt: QuizAttempt) => {
    setQuizAttempts(prev => [attempt, ...prev]);
  };

  const handleClearData = () => {
    setBookmarks([]);
    setNotes([]);
    setQuizAttempts([]);
    setCompletedTopicIds([]);
    localStorage.removeItem('icse_bookmarks');
    localStorage.removeItem('icse_notes');
    localStorage.removeItem('icse_quiz_attempts');
    localStorage.removeItem('icse_completed_topics');
  };

  const defaultOverview: CourseOverview = {
    title: "ICSE Class 10 Biology: Interactive Academic Dashboard",
    total_units: 14,
    total_topics: 42,
    total_pages: 33,
    description: "Interactive 3D academic learning dashboard grounded in official ICSE Class 10 Biology curriculum, revision notes, location/function registries, and solved board examination papers.",
    source_files: [
      "Biology - Revision Notes.pdf",
      "Biology - Location and Functions.pdf",
      "Biology - Suggestive Questions.pdf",
      "Biology - Model Test Paper - 1, 2, 3 (Solved).pdf"
    ],
    chapters: []
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-burgundy-950 text-slate-100 font-sans selection:bg-wine-500 selection:text-white">
      {/* 13-Item Academic Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        totalChapters={chapters.length || 14}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Global Academic Header */}
        <Header
          currentTab={currentTab}
          onNavigateTab={setCurrentTab}
          isDark={theme === 'dark'}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onOpenUploadModal={() => setCurrentTab('settings')}
          onGlobalSearch={handleGlobalSearch}
          courseTitle={overview?.title || "ICSE Class 10 Biology"}
        />

        {/* Scrollable Viewport Container */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar">
          {currentTab === 'overview' && (
            <OverviewDashboard
              overview={overview || defaultOverview}
              onNavigateTab={setCurrentTab}
              onSelectChapter={handleSelectChapter}
              onOpen3dDemo={handleOpen3dDemo}
            />
          )}

          {currentTab === 'pdf-explorer' && (
            <PdfExplorer
              chapters={chapters}
              initialPage={targetPage}
              onAddBookmark={handleAddBookmark}
              bookmarks={bookmarks}
              onAskAiAboutPage={(text, p) => {
                setAiAssistantQuery(`Explain page ${p}: "${text.slice(0, 150)}..." in student-friendly language`);
                setCurrentTab('ask-questions');
              }}
            />
          )}

          {currentTab === 'units-topics' && (
            <UnitsAndTopics
              chapters={chapters}
              selectedChapterId={targetChapterId}
              onNavigateTab={setCurrentTab}
              onJumpToPage={handleJumpToPage}
              onOpen3dDemo={handleOpen3dDemo}
            />
          )}

          {currentTab === '3d-demos' && (
            <ThreeLab
              initialDemoId={targetDemoId}
              onJumpToPage={handleJumpToPage}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'concept-viz' && (
            <ConceptVisualizations
              onJumpToPage={handleJumpToPage}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'ask-questions' && (
            <AiAssistant
              initialQuery={aiAssistantQuery}
              onJumpToPage={handleJumpToPage}
              onNavigateTab={setCurrentTab}
            />
          )}

          {(currentTab === 'step-solutions' || currentTab === 'numerical-problems') && (
            <ProblemSolver
              onNavigateToPage={handleJumpToPage}
            />
          )}

          {currentTab === 'practice-tests' && (
            <PracticeTests
              onTestComplete={handleQuizComplete}
              onNavigateToPage={handleJumpToPage}
            />
          )}

          {currentTab === 'question-bank' && (
            <QuestionBank
              onNavigateToPage={handleJumpToPage}
              onBookmarkQuestion={handleBookmarkQuestion}
              bookmarkedIds={bookmarks.map(b => b.id)}
            />
          )}

          {currentTab === 'bookmarks-notes' && (
            <BookmarksAndNotes
              bookmarks={bookmarks}
              notes={notes}
              chapters={chapters}
              onDeleteBookmark={handleDeleteBookmark}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onNavigateToPage={handleJumpToPage}
            />
          )}

          {currentTab === 'progress-analytics' && (
            <AnalyticsDashboard
              attempts={quizAttempts}
              bookmarks={bookmarks}
              notes={notes}
              totalTopics={overview?.total_topics || 42}
              completedTopicIds={completedTopicIds}
              onStartPractice={() => setCurrentTab('practice-tests')}
              onNavigateToTopic={handleSelectChapter}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              theme={theme}
              onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              onClearData={handleClearData}
              onPdfUploaded={loadCourseData}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
