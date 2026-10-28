# ICSE Class 10 Biology: Interactive 3D Academic Learning Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Production-black?style=for-the-badge&logo=vercel)](https://frontend-rho-three-17.vercel.app)
[![React 19](https://img.shields.io/badge/React-19.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-1.0-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

An academic learning platform grounded strictly in official curriculum documents (**ICSE Class 10 Biology Revision Notes**, **Location & Functions Registry**, and **Solved Board Papers**).

Built with a **Python FastAPI** knowledge retrieval backend, **native OCR pipeline**, **Three.js WebGL 3D simulation laboratory**, **Physics-Informed Neural Networks (PINN)** simulations, and a **React 19 + TypeScript** user interface styled in an academic burgundy/wine dark glassmorphism aesthetic.

---

## Live Deployments & Local Access

- **Live Production App (Vercel):** [https://frontend-rho-three-17.vercel.app](https://frontend-rho-three-17.vercel.app)
- **Local Web Dashboard:** [http://localhost:8000/](http://localhost:8000/) or [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **FastAPI REST Docs (Swagger UI):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Vite Hot-Reload Dev Server:** [http://127.0.0.1:5180/](http://127.0.0.1:5180/)

---

## Key Features

### 1. 3D WebGL Biomolecular & Physiological Simulation Laboratory
- **DNA Double Helix:** Interactive 3D visualization of antiparallel polynucleotide strands, complementary base pairing (Adenine–Thymine with 2 H-bonds, Guanine–Cytosine with 3 H-bonds), major/minor grooves, and unwinding animations.
- **Human Heart & Valvular Cycle:** 4-chambered cross-section rendering with synchronized systolic/diastolic valve timings (Tricuspid, Bicuspid/Mitral, Aortic Semilunar, Pulmonary Semilunar), blood flow vectors, and variable heart rate controls.
- **Nephron Ultrafiltration Barrier:** Detailed Malpighian body (Bowman's capsule + Glomerulus) showing differential diameters of afferent vs. efferent arterioles, hydrostatic ultrafiltration pressure, podocyte filtration slits, and filtrate collection.
- **Human Eye Optics & Accommodation:** Cross-sectional ocular geometry illustrating cornea, crystalline lens curvature alterations via ciliary body contractions, fovea centralis / blind spot, and ray-tracing demonstrations of Myopia (nearsightedness corrected with biconcave lenses) and Hyperopia (farsightedness corrected with biconvex lenses).
- **Stomatal Guard Cell Mechanism:** Interactive potassium ion ($K^+$) active transport simulation demonstrating guard cell turgor pressure changes, differential cell wall elasticity, and daytime opening vs. nighttime closing of stomatal apertures.

### 2. Physics-Informed Neural Network (PINN) Simulations
- **Coupled Hemodynamics PINN:** Real-time surrogate neural network evaluating 2D Navier-Stokes momentum equations ($\rho (\mathbf{u} \cdot \nabla)\mathbf{u} = -\nabla p + \mu \nabla^2 \mathbf{u}$) and mass conservation ($\nabla \cdot \mathbf{u} = 0$) across cardiac chambers and arterial bifurcations, rendering wall shear stress (WSS) and vortex turbulence.
- **Ocular Wavefront PINN:** Solves the Eikonal equation and Fermat's Principle of Least Time ($\delta \int n(\mathbf{x}) ds = 0$) through gradient-index ocular media (cornea $n=1.376$, aqueous humor $n=1.336$, crystalline lens $n=1.406$, vitreous humor $n=1.336$), predicting focal convergence errors.

### 3. Audio Voice Narrator & Multi-Modal Pedagogy
- **Web Speech API Narrator:** Integrated vocal explanations for every 3D model, high-yield ICSE board exam topics, and problem-solving steps.
- **Vocal Controls:** Configurable speech rate, voice selection, pitch adjustment, and synchronized caption displays.

### 4. Step-by-Step Problem Solver (KaTeX Math Rendering)
- **Genetics Cross Calculator:** Interactive Punnett Square solver for monohybrid ($3:1$ phenotypic, $1:2:1$ genotypic) and dihybrid ($9:3:3:1$) crosses, backcrosses, test crosses, and human sex determination ($XX$ vs $XY$).
- **Physiological Formulas:** Automatic calculation and step-by-step LaTeX derivation for Cardiac Output ($\text{CO} = \text{SV} \times \text{HR}$), Vital Capacity ($\text{VC} = \text{TV} + \text{IRV} + \text{ERV}$), Glomerular Filtration Rate, and Photosynthesis/Respiration stoichiometry.

### 5. Grounded RAG Assistant (Course-Anchored AI)
- **Textbook Grounding:** Built on PyMuPDF text and table extraction with TF-IDF vector retrieval over official ICSE Class 10 Biology revision notes.
- **Strict Citation Engine:** Every response cites specific page numbers and syllabus unit definitions from the approved course material.
- **6 Pedagogical Styles:**
  - *Simple & Direct* (concise revision)
  - *Academic / Textbook* (standard board answer format)
  - *Examiner's Tip* (common errors and keyword marking criteria)
  - *Diagrammatic Description* (labels, arrows, and spatial relations)
  - *Step-by-Step* (sequential biological mechanisms)
  - *Mnemonic & Memory Aids* (acronyms and recall tricks)

### 6. Interactive Question Bank & Timed Exam Simulator
- **Comprehensive Question Bank:** Categorized by chapter, difficulty (Easy, Medium, Hard), and ICSE question types (MCQ, Give Biological Reasons, Differentiate Between, Name the Following, Diagram Questions).
- **Exam Simulator:** Timed practice test papers with instant automatic scoring, detailed explanations, and performance diagnostics.

### 7. Dual Operation: Full-Stack & Standalone Offline
- **Full-Stack Mode:** FastAPI backend handles live PDF image rasterization, vector searches, and custom document indexing.
- **Offline Client-Side Mode:** Embedded TypeScript knowledge databases enable 100% of the UI, 3D labs, PINN simulations, and question banks to function completely without an internet connection or backend server.

---

## Repository Structure

```
icse-bio/
├── .github/                     # GitHub workflows and automation
├── backend/                     # Python FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application & API endpoints
│   │   ├── models.py            # Pydantic data schemas & contracts
│   │   ├── pdf_engine.py        # PDF indexing, OCR & 14-unit knowledge engine
│   │   └── rag_service.py       # TF-IDF retrieval, genetics & formula solvers
│   ├── tests/
│   │   └── test_pdf_engine.py   # Pytest suite for knowledge base & solvers
│   └── requirements.txt         # FastAPI, PyMuPDF, Scikit-learn, etc.
├── curriculum/                  # Official ICSE Curriculum Documents & Assets
│   ├── Biology - Revision Notes.pdf
│   ├── Biology - Location and Functions.pdf
│   ├── Biology - Notes.pdf
│   ├── Biology - Suggestive Questions.pdf
│   ├── Biology - Model Test Paper - 1 (Solved).pdf
│   ├── Biology - Model Test Paper - 2 (Solved).pdf
│   ├── Biology - Model Test Paper - 3 (Solved).pdf
│   ├── Biology - Important Diagrams.pdf
│   ├── Biology - Important Diagrams Sheet.jpeg
│   ├── Biology - Chapterwise Weightage.jpg
│   ├── PW Endgame Notes - 2026.pdf
│   └── extracted_revision_notes.json
├── docs/                        # Specifications and design plans
│   └── superpowers/
│       ├── plans/
│       └── specs/
├── frontend/                    # React 19 + TypeScript + Vite Single-Page Application
│   ├── public/                  # Static assets and icons
│   ├── src/
│   │   ├── components/          # Navigation, Header, Layout
│   │   ├── features/
│   │   │   ├── ai-assistant/    # RAG assistant with 6 pedagogical styles
│   │   │   ├── analytics/       # Student mastery tracking & analytics
│   │   │   ├── bookmarks/       # Saved questions and textbook notes
│   │   │   ├── overview/        # 14-unit curriculum matrix & board weightage
│   │   │   ├── pdf-explorer/    # High-resolution textbook page viewer
│   │   │   ├── practice-tests/  # Timed ICSE exam simulator
│   │   │   ├── problem-solver/  # KaTeX math & genetics solver
│   │   │   ├── question-bank/   # Curated ICSE board questions
│   │   │   ├── settings/        # Theme & configuration panel
│   │   │   ├── three-lab/       # Interactive 3D WebGL scenes & PINN engine
│   │   │   ├── topics/          # Detailed unit syllabus explorer
│   │   │   └── visualizations/  # 2D interactive physiological cycles
│   │   ├── services/api.ts      # Resilient API client with offline fallback
│   │   └── types/               # Shared TypeScript interfaces
│   ├── dist/                    # Compiled production bundle
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json              # Vercel deployment & SPA routing rules
│   └── vite.config.ts
├── run_dashboard.bat            # One-click Windows desktop launcher
├── .gitignore                   # Multi-tier git exclusion rules
└── README.md                    # Project documentation
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0 or newer
- **Python**: v3.10 or newer (for local backend execution)

---

### Option 1: Quickstart (Windows One-Click)
Double-click `run_dashboard.bat` in the root folder, or execute:
```cmd
run_dashboard.bat
```
This automatically starts the backend server and opens `http://localhost:8000/` in your default browser.

---

### Option 2: Running Frontend in Development Mode
To develop or preview the frontend with hot-module replacement (HMR):
```powershell
cd frontend
npm install
npm run dev
```
Open [http://localhost:5180](http://localhost:5180) to interact with the frontend.

---

### Option 3: Running Backend Server
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
View the interactive Swagger API documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

### Option 4: Deploying to Vercel
The frontend is pre-configured with `frontend/vercel.json` for zero-configuration Vite SPA deployment on Vercel:
```powershell
cd frontend
npx vercel --prod
```
The application will be compiled and deployed directly to Vercel's global edge network.

---

## Testing & Quality Assurance

To execute the backend test suite:
```powershell
cd backend
python -m pytest tests/ -v
```
All tests verify data contract schemas, PDF OCR extraction, RAG similarity gating, and genetics solver calculations.

To execute the frontend static analysis:
```powershell
cd frontend
npm run lint
npm run build
```

---

## Curriculum Syllabus Coverage (14 Units)

1. **Cell Cycle, Cell Division & Chromosomes** (Mitosis stages, Meiosis, Centromeres, Nucleosomes)
2. **Genetics: Fundamentals** (Mendelian Laws, Monohybrid & Dihybrid crosses, Sex determination)
3. **Absorption by Roots** (Osmosis, Diffusion, Turgor & Wall pressure, Plasmolysis, Root hair structure)
4. **Transpiration** (Stomatal mechanism, Factors affecting transpiration, Guttation, Bleeding)
5. **Photosynthesis** (Light and Dark reactions, Photolysis, Chloroplast ultrastructure, Limiting factors)
6. **Chemical Coordination in Plants** (Auxins, Gibberellins, Cytokinins, Abscisic acid, Ethylene, Tropic movements)
7. **Circulatory System** (Heart anatomy, Cardiac cycle, Double circulation, Blood groups, Rh factor)
8. **Excretory System** (Kidney structure, Nephron histology, Ultrafiltration, Selective reabsorption)
9. **Nervous System & Sense Organs** (Neuron structure, Synapse, Brain regions, Reflex arc, Eye defects, Ear anatomy)
10. **Endocrine System** (Pituitary, Thyroid, Adrenal, Pancreas hormones, Feedback mechanisms, Disorders)
11. **Reproductive System** (Male & female anatomy, Menstrual cycle, Fertilization, Placenta function)
12. **Human Evolution** (Australopithecus to Homo sapiens, Cranial capacity evolution, Lamarck vs. Darwin)
13. **Population** (Natality, Mortality, Population growth curves, Control measures)
14. **Pollution** (Air, Water, Soil, Noise, Radiation, Acid rain, Eutrophication, Biomagnification)

---

## License

This project is licensed under the MIT License.
