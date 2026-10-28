export interface TopicItem {
  id: string;
  unit_id: number;
  unit_title: string;
  topic_name: string;
  summary: string;
  page_number: number;
  definitions: string[];
  formulas: string[];
  demonstration_id?: string;
  diagram_reference?: string;
}

export interface ChapterItem {
  id: number;
  number: number;
  title: string;
  page_start: number;
  page_end: number;
  weightage_marks: number;
  summary: string;
  has_3d_demo: boolean;
  demo_id?: string;
  topics: TopicItem[];
}

export type Chapter = ChapterItem;

export interface CourseOverview {
  title: string;
  total_units: number;
  total_topics: number;
  total_pages: number;
  description: string;
  source_files: string[];
  chapters: ChapterItem[];
}

export interface Citation {
  page: number;
  chapter: string;
  excerpt: string;
}

export interface RAGResponse {
  query: string;
  style: string;
  direct_answer: string;
  definition?: string;
  detailed_explanation?: string;
  step_by_step: string[];
  formula?: string;
  practical_example?: string;
  exam_summary?: string;
  supporting_citations: Citation[];
  is_grounded: boolean;
  suggested_followups: string[];
}

export interface SolutionStep {
  step_number: number;
  title: string;
  explanation: string;
  math_formula?: string;
  calculation?: string;
}

export interface ProblemSolution {
  original_problem: string;
  topic: string;
  given_values: Record<string, string>;
  required_result: string;
  concept_applied: string;
  source_page: number;
  steps: SolutionStep[];
  final_result: string;
  common_mistakes: string[];
  similar_practice_hint: string;
  verification_check: string;
}

export interface QuestionItem {
  id: string;
  chapter_id: number;
  chapter_title: string;
  topic: string;
  question_type: 'mcq' | 'fill_in_blank' | 'give_reason' | 'differentiate' | 'diagram';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  supporting_page: number;
  marks: number;
}

export interface BookmarkItem {
  id: string;
  title: string;
  page: number;
  chapter: string;
  note: string;
  created_at: string;
}

export interface StudyNote {
  id: string;
  topic_id?: string;
  chapter_title: string;
  content: string;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  date: string;
  chapter_id?: number;
  chapter_title: string;
  score: number;
  total: number;
  percentage: number;
  time_spent_seconds: number;
}

export interface LocationFunctionItem {
  structure: string;
  location: string;
  function: string;
}

export type NavigationTab = 
  | 'overview'
  | 'pdf-explorer'
  | 'units-topics'
  | '3d-demos'
  | 'concept-viz'
  | 'ask-questions'
  | 'step-solutions'
  | 'numerical-problems'
  | 'practice-tests'
  | 'question-bank'
  | 'bookmarks-notes'
  | 'progress-analytics'
  | 'settings';
