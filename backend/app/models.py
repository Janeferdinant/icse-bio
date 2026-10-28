from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Citation(BaseModel):
    page: int
    chapter: str
    excerpt: str

class PageData(BaseModel):
    page: int
    text: str
    chapter: str
    key_terms: List[str] = Field(default_factory=list)
    diagrams: List[str] = Field(default_factory=list)

class TopicItem(BaseModel):
    id: str
    unit_id: int
    unit_title: str
    topic_name: str
    summary: str
    page_number: int
    definitions: List[str] = Field(default_factory=list)
    formulas: List[str] = Field(default_factory=list)
    demonstration_id: Optional[str] = None
    diagram_reference: Optional[str] = None

class ChapterItem(BaseModel):
    id: int
    number: int
    title: str
    page_start: int
    page_end: int
    weightage_marks: int = 10
    summary: str
    topics: List[TopicItem] = Field(default_factory=list)
    has_3d_demo: bool = False
    demo_id: Optional[str] = None

class CourseOverview(BaseModel):
    title: str
    total_units: int
    total_topics: int
    total_pages: int
    description: str
    source_files: List[str] = Field(default_factory=list)
    chapters: List[ChapterItem] = Field(default_factory=list)

class RAGQuery(BaseModel):
    question: str
    style: str = "simple"  # simple, detailed, exam, numerical, practical, revision
    chapter_id: Optional[int] = None

class RAGResponse(BaseModel):
    query: str
    style: str
    direct_answer: str
    definition: Optional[str] = None
    detailed_explanation: Optional[str] = None
    step_by_step: List[str] = Field(default_factory=list)
    formula: Optional[str] = None
    practical_example: Optional[str] = None
    exam_summary: Optional[str] = None
    supporting_citations: List[Citation] = Field(default_factory=list)
    is_grounded: bool = True
    suggested_followups: List[str] = Field(default_factory=list)

class SolutionStep(BaseModel):
    step_number: int
    title: str
    explanation: str
    math_formula: Optional[str] = None
    calculation: Optional[str] = None

class ProblemRequest(BaseModel):
    problem_text: str
    chapter_id: Optional[int] = None

class ProblemSolution(BaseModel):
    original_problem: str
    topic: str
    given_values: Dict[str, str] = Field(default_factory=dict)
    required_result: str
    concept_applied: str
    source_page: int
    steps: List[SolutionStep] = Field(default_factory=list)
    final_result: str
    common_mistakes: List[str] = Field(default_factory=list)
    similar_practice_hint: str
    verification_check: str

class QuestionItem(BaseModel):
    id: str
    chapter_id: int
    chapter_title: str
    topic: str
    question_type: str  # mcq, fill_in_blank, give_reason, differentiate, diagram
    difficulty: str  # easy, medium, hard
    question: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: str
    supporting_page: int
    marks: int = 1

class BookmarkItem(BaseModel):
    id: str
    title: str
    page: int
    chapter: str
    note: str = ""
    created_at: str

class StudyProgress(BaseModel):
    completed_topics: List[str] = Field(default_factory=list)
    bookmarked_pages: List[int] = Field(default_factory=list)
    quiz_scores: List[Dict[str, Any]] = Field(default_factory=list)
    time_spent_seconds: int = 0
