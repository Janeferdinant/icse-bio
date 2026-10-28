import os
import pytest
from app.models import CourseOverview, QuestionItem, RAGResponse, SolutionStep
from app.pdf_engine import PDFKnowledgeEngine
from app.rag_service import RAGService

def test_models_instantiation():
    overview = CourseOverview(
        title="ICSE Class 10 Biology",
        total_units=14,
        total_topics=45,
        total_pages=33,
        description="Comprehensive ICSE Class 10 Biology Learning Dashboard",
        source_files=["Biology - Revision Notes.pdf"]
    )
    assert overview.title == "ICSE Class 10 Biology"
    assert overview.total_units == 14

def test_pdf_engine_loads_extracted_knowledge():
    engine = PDFKnowledgeEngine()
    overview = engine.get_overview()
    assert overview.total_units >= 10
    assert len(engine.get_chapters()) >= 10
    
    # Check page retrieval
    page_1 = engine.get_page(1)
    assert page_1 is not None
    assert "cell" in page_1.text.lower() or "chromosom" in page_1.text.lower()

def test_rag_service_grounded_answer():
    engine = PDFKnowledgeEngine()
    rag = RAGService(engine)
    
    # Grounded question
    res: RAGResponse = rag.ask("Why do cells divide?", style="simple")
    assert res.is_grounded is True
    assert len(res.supporting_citations) > 0
    assert any("1" in str(c.page) for c in res.supporting_citations)
    
    # Ungrounded question (out of scope)
    ungrounded_res = rag.ask("What is quantum chromodynamics in string theory?", style="simple")
    assert ungrounded_res.is_grounded is False
    assert "not contain" in ungrounded_res.direct_answer.lower() or "outside" in ungrounded_res.direct_answer.lower()

def test_problem_solver_numerical():
    engine = PDFKnowledgeEngine()
    rag = RAGService(engine)
    
    # Test cardiac output calculation
    sol = rag.solve_problem("Calculate the cardiac output of an athlete with heart rate 75 beats per minute and stroke volume 70 ml.")
    assert sol.final_result is not None
    assert "5250" in sol.final_result or "5.25" in sol.final_result
    assert len(sol.steps) >= 2
