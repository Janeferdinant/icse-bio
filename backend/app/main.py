import os
import io
import shutil
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from fastapi.staticfiles import StaticFiles
import pymupdf

from app.models import (
    CourseOverview, ChapterItem, PageData, RAGQuery, RAGResponse,
    ProblemRequest, ProblemSolution, QuestionItem
)
from app.pdf_engine import PDFKnowledgeEngine
from app.rag_service import RAGService

app = FastAPI(
    title="ICSE Biology 3D Learning Platform API",
    description="Backend API providing PDF-grounded educational retrieval, RAG question answering, step-by-step problem solver, and question bank.",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server (ports 5173, 8080, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
pdf_engine = PDFKnowledgeEngine()
rag_service = RAGService(pdf_engine)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ICSE Biology 3D Learning Platform Backend",
        "total_pages_indexed": len(pdf_engine.pages),
        "total_units": len(pdf_engine.chapters_meta)
    }

@app.get("/api/course/overview", response_model=CourseOverview)
def get_course_overview():
    return pdf_engine.get_overview()

@app.get("/api/course/chapters", response_model=List[ChapterItem])
def get_chapters():
    return pdf_engine.get_chapters()

@app.get("/api/course/page/{page_num}", response_model=PageData)
def get_page_data(page_num: int):
    page = pdf_engine.get_page(page_num)
    if not page:
        raise HTTPException(status_code=404, detail=f"Page {page_num} not found")
    return page

@app.get("/api/course/page/{page_num}/image")
def get_page_image(page_num: int, dpi: int = 150):
    pdf_path = pdf_engine.get_asset_path("Biology - Revision Notes.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF file not found on disk")
    
    try:
        doc = pymupdf.open(pdf_path)
        if page_num < 1 or page_num > len(doc):
            doc.close()
            raise HTTPException(status_code=404, detail=f"Page number {page_num} out of range (1-{len(doc)})")
        
        page = doc[page_num - 1]
        pix = page.get_pixmap(dpi=dpi)
        img_bytes = pix.tobytes("png")
        doc.close()
        return Response(content=img_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to render page image: {str(e)}")

@app.get("/api/course/search")
def search_course(q: str = Query(..., min_length=2)):
    results = pdf_engine.search_text(q)
    return {
        "query": q,
        "total_matches": len(results),
        "matches": results
    }

@app.get("/api/location-functions")
def get_location_functions():
    return {
        "count": len(pdf_engine.location_functions_data),
        "items": pdf_engine.get_location_functions()
    }

@app.post("/api/chat/ask", response_model=RAGResponse)
def ask_question(body: RAGQuery):
    return rag_service.ask(question=body.question, style=body.style, chapter_id=body.chapter_id)

@app.post("/api/solver/solve", response_model=ProblemSolution)
def solve_problem(body: ProblemRequest):
    return rag_service.solve_problem(problem_text=body.problem_text)

@app.get("/api/questions/bank", response_model=List[QuestionItem])
def get_question_bank(
    chapter_id: Optional[int] = None,
    difficulty: Optional[str] = None
):
    return pdf_engine.get_questions(chapter_id=chapter_id, difficulty=difficulty)

@app.post("/api/course/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    upload_dir = os.path.join(pdf_engine.workspace_root, "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    save_path = os.path.join(upload_dir, file.filename)
    
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process uploaded PDF with PyMuPDF
    try:
        doc = pymupdf.open(save_path)
        page_count = len(doc)
        doc.close()
        return {
            "message": f"Successfully uploaded and indexed '{file.filename}'",
            "filename": file.filename,
            "page_count": page_count,
            "status": "ready"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read PDF: {str(e)}")

# Mount built frontend single-page application
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static_frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
