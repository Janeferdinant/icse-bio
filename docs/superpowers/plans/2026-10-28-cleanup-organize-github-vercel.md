# Clean Up, Organize, GitHub Push & Vercel Deployment Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up and organize the ICSE Class 10 Biology codebase by removing duplicate/unrelated files, structuring curriculum resources, updating documentation, committing to Git, pushing to GitHub using WCM credentials, and deploying the latest build to Vercel.

**Architecture:** 
1. Prune junk and duplicated files while keeping genuine curriculum artifacts organized in a dedicated `curriculum/` folder.
2. Update backend loader to gracefully resolve files in either root or `curriculum/`.
3. Provide a production-grade root `.gitignore`.
4. Rewrite root `README.md` to comprehensively highlight all modern platform capabilities (Three.js 3D WebGL, PINN hemodynamic & optical simulations, KaTeX solver, Audio narration, RAG, and Vercel hosting).
5. Securely authenticate with GitHub and Vercel using credentials retrieved directly from Windows Credential Manager (WCM) without leaking tokens.

**Tech Stack:** React 19, TypeScript, Three.js WebGL, KaTeX, Python FastAPI, PyMuPDF, Windows Credential Manager (advapi32 / wincred), Git, GitHub API, Vercel CLI.

---

## Global Constraints

- Never log, print, or leak raw authentication tokens or secrets into terminal output, files, or chat context.
- All curriculum files used by `pdf_engine.py` must remain completely accessible and functional.
- The repository must cleanly build (`npm run build` in frontend) before committing and deploying.
- Follow surgical, non-breaking modifications.

---

## Tasks

### Task 1: Clean Up Redundant & Unrelated Files

**Files to remove:**
- Unrelated non-biology PDFs:
  - `100 Most Important Phrasal Verbs.pdf`
  - `English Language - Catchy Titles for Notice - 2.pdf`
  - `English Language - Model Test Paper - 3 (Unsolved).pdf`
  - `English Literature - Chapterwise Study Guide.pdf`
- Duplicate PDF copies:
  - `Biology - Notes (1).pdf`
  - `Biology - Revision Notes (1).pdf`
  - `Biology - Revision Notes (2).pdf`

- [ ] **Step 1: Verify files exist before removal**
- [ ] **Step 2: Delete duplicate and unrelated files**
- [ ] **Step 3: Confirm root directory no longer contains duplicates or English files**

---

### Task 2: Organize Curriculum Resources & Update Backend Loader

**Files to create/modify:**
- Directory: `curriculum/`
- Move curriculum assets to `curriculum/`:
  - `Biology - Chapterwise Weightage.jpg`
  - `Biology - Important Diagrams Sheet.jpeg`
  - `Biology - Important Diagrams.pdf`
  - `Biology - Location and Functions.pdf`
  - `Biology - Model Test Paper - 1 (Solved).pdf`
  - `Biology - Model Test Paper - 2 (Solved).pdf`
  - `Biology - Model Test Paper - 3 (Solved).pdf`
  - `Biology - Notes.pdf`
  - `Biology - Revision Notes.pdf`
  - `Biology - Suggestive Questions.pdf`
  - `PW Endgame Notes - 2026.pdf`
  - `extracted_revision_notes.json`
- Modify: `backend/app/pdf_engine.py` to resolve files from both root and `curriculum/`.
- Create: Root `.gitignore` to prevent tracking build artifacts, cache, and sensitive files.

- [ ] **Step 1: Create `curriculum/` directory and move genuine course files into it**
- [ ] **Step 2: Update `backend/app/pdf_engine.py` to support `curriculum/` and root paths**
- [ ] **Step 3: Run pytest on backend tests to verify engine loads properly**
- [ ] **Step 4: Create root `.gitignore`**

---

### Task 3: Comprehensive README.md Documentation

**Files to modify:**
- `README.md`

- [ ] **Step 1: Draft comprehensive README detailing:**
  - Executive summary and live Vercel URL
  - Complete feature catalog:
    - 3D Interactive WebGL Laboratory (Heart, Nephron, Eye, Stomata, DNA)
    - Physics-Informed Neural Network (PINN) simulations (Hemodynamics & Optics)
    - Audio Interactive Voice Narrator with Web Speech API
    - Grounded RAG Assistant & Textbook citations
    - Step-by-Step KaTeX Math & Genetics Solver
    - Interactive Question Bank & Practice Exam Simulator
  - Tech stack & architecture diagram
  - Repository directory structure
  - Local setup & one-click launch guide (`run_dashboard.bat`)
  - Vercel deployment guide
- [ ] **Step 2: Write updated `README.md`**

---

### Task 4: Git Initialization, Commit & Push to GitHub via WCM Credentials

**Actions:**
- Initialize git repo in workspace root.
- Configure local git user if needed (`Janeferdinant`).
- Check or create `icse-bio` remote repository on GitHub for user `Janeferdinant` via GitHub API with WCM token.
- Add remote and push to `main` branch.

- [ ] **Step 1: Initialize git in workspace root and check `git status`**
- [ ] **Step 2: Stage files and make initial structured commit**
- [ ] **Step 3: Verify / create remote repository `icse-bio` on GitHub using WCM token**
- [ ] **Step 4: Push `main` branch to GitHub repository**

---

### Task 5: Production Build & Deploy to Vercel via WCM Credentials

**Actions:**
- Verify frontend builds cleanly (`npm run build`).
- Execute Vercel deployment with WCM Vercel token targeting production (`--prod`).
- Verify production deployment URL and HTTP response.

- [ ] **Step 1: Run frontend production build**
- [ ] **Step 2: Execute Vercel deploy using WCM credential**
- [ ] **Step 3: Verify live URL is accessible and operational**
