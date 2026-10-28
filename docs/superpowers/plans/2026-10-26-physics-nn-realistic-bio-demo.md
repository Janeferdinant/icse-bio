# 5th-Grade Realistic 3D Biology Lab & Physics-NN Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the 3D biological laboratory into a high-fidelity, realistic interactive simulator for 5th graders with authentic Stomata, Eye, and Heart anatomical 3D models, an in-browser Physics-Informed Neural Network (PINN) engine, and a friendly Web Speech API voice-over narrator ("Dr. Bio").

**Architecture:** Split-screen dual-lab layout in React + Three.js + TypeScript: the left panel renders realistic, multi-layered 3D cross-sections (anatomically grounded in textbook/internet diagrams); the right panel runs a real-time client-side Physics Neural Network calculating biological law residuals (osmotic turgor, Snell's law optics, Navier-Stokes hemodynamics) and controls cheerful audio narration with synchronized captions.

**Tech Stack:** React 19, TypeScript, Three.js, Lucide Icons, Web Speech API (`SpeechSynthesis`), TailwindCSS.

**Spec:** `docs/superpowers/specs/2026-10-26-physics-nn-realistic-bio-demo-design.md`

## Global Constraints

- Pure client-side execution in React 19 + TypeScript (no server-side Python/PyTorch dependencies required for 60 FPS interactions).
- Realistic morphological anatomy matching authentic scientific diagrams:
  - Stomata: Kidney-bean guard cells, thick inner cellulose walls, chloroplasts, central vacuoles, jigsaw epidermal cells.
  - Eye: Sagittal cross-section with cornea, iris, pupil, flexible biconvex lens, ciliary muscles with suspensory zonules, retina, fovea, optic nerve, and ray-tracing light beams.
  - Heart: Coronal cross-section with 4 chambers, tricuspid & mitral valves with chordae tendineae and papillary muscles, aorta with 3 arch branches, vena cava, septum, and pulsing blood corpuscles.
- Kid-friendly voice-over audio player ("Dr. Bio") with pitch 1.15, rate 0.95, and live captions.
- Zero TypeScript or Vite build errors (`npm run build` must pass cleanly after every task).

## Review Focus

1. **SpeechSynthesis unsupported or muted by browser policy:** System must gracefully display live subtitle text without crashing or throwing unhandled errors when speech is blocked.
2. **Extreme slider parameter inputs (e.g., zero turgor pressure or zero accommodation):** PINN calculations must clamp to positive non-zero physical bounds to prevent `NaN` or division by zero.
3. **Rapid scene switching:** When a user switches between Heart, Eye, and Stomata, previous speech utterances and Three.js animation frames/geometries must be immediately cancelled and cleaned up.
4. **Mobile / small screen responsiveness:** Split-screen layout must collapse into a stacked column layout on mobile viewports so 3D canvases and sliders remain usable.
5. **High device pixel ratio rendering:** Three.js renderers must clamp pixel ratio to $\min(\text{devicePixelRatio}, 2)$ to maintain 60 FPS performance.

---

### Task 1: Voice-Over Narrator System ("Dr. Bio") & Narration Scripts

**Files:**
- Create: `frontend/src/features/three-lab/audio/voiceNarrator.ts`
- Create: `frontend/src/features/three-lab/audio/scriptData.ts`

**Interfaces:**
- Produces:
  - `export interface VoiceNarratorState { isSpeaking: boolean; isPaused: boolean; currentText: string; isSupported: boolean; }`
  - `export class VoiceNarrator { speak(text: string, onEnd?: () => void, onBoundary?: (charIndex: number) => void): void; pause(): void; resume(): void; stop(): void; isSupported(): boolean; }`
  - `export interface OrganScript { title: string; intro: string; kidAnalogy: string; funFacts: Record<string, string>; physicsExplanation: string; }`
  - `export const BIO_SCRIPTS: Record<string, OrganScript>;`

- [ ] **Step 1: Create `scriptData.ts` with 5th-grade narration scripts**
  Define cheerful, engaging scripts for Stomata, Eye, and Heart with kid analogies ("plant lips breathing", "organic camera", "superhero dual pump") and component fun-facts.

- [ ] **Step 2: Create `voiceNarrator.ts` with Web Speech API wrapper**
  Implement safe `SpeechSynthesis` controller with proper pitch ($1.15$), rate ($0.95$), error handling for unsupported environments, and speech cancel/pause/resume methods.

- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npm run build` in `frontend`
  Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**
  ```bash
  git add frontend/src/features/three-lab/audio/
  git commit -m "feat(three-lab): add Dr. Bio voice-over audio narrator and 5th-grade script database"
  ```

---

### Task 2: Physics-Informed Neural Network (PINN) Engine

**Files:**
- Create: `frontend/src/features/three-lab/physics-nn/types.ts`
- Create: `frontend/src/features/three-lab/physics-nn/stomataPinn.ts`
- Create: `frontend/src/features/three-lab/physics-nn/eyeOpticsPinn.ts`
- Create: `frontend/src/features/three-lab/physics-nn/hemodynamicsPinn.ts`

**Interfaces:**
- Produces:
  - `export interface PinnEvaluation { dataLoss: number; physicsLoss: number; totalLoss: number; predictions: Record<string, number>; activeWeights: number[][]; inferenceTimeMs: number; }`
  - `export function evaluateStomataPinn(turgor: number, kIon: number, lightCondition: 'day'|'night'|'drought'): PinnEvaluation;`
  - `export function evaluateEyeOpticsPinn(visionMode: string, accommodation: number, objectDistCm?: number): PinnEvaluation;`
  - `export function evaluateHemodynamicsPinn(heartRate: number, exerciseLevel: number, resistance?: number): PinnEvaluation;`

- [ ] **Step 1: Define PINN types in `types.ts`**
  Declare input/output schemas, loss metrics, and neural network layer interfaces.

- [ ] **Step 2: Implement `stomataPinn.ts`**
  Model van 't Hoff osmotic equilibrium $\Delta P = \Pi - \sigma$ and predict stomatal aperture width ($0 - 12\,\mu\text{m}$), transpiration rate, and cellulose hoop stress residual.

- [ ] **Step 3: Implement `eyeOpticsPinn.ts`**
  Model Snell's law refraction and Lensmaker equation $\frac{1}{f} = (n-1)(\frac{1}{R_1} - \frac{1}{R_2})$, predicting focal length $f$, focal point on retina, image blur circle, and corrective diopters.

- [ ] **Step 4: Implement `hemodynamicsPinn.ts`**
  Model Poiseuille/Navier-Stokes blood pressure-flow $Q = \frac{\Delta P}{R}$, predicting LV peak systolic pressure ($mmHg$), stroke volume ($mL$), cardiac output ($L/min$), and flow resistance.

- [ ] **Step 5: Verify mathematical outputs & compile**
  Run: `npm run build` in `frontend`
  Expected: PASS with 0 errors.

- [ ] **Step 6: Commit**
  ```bash
  git add frontend/src/features/three-lab/physics-nn/
  git commit -m "feat(three-lab): implement client-side Physics-NN engines for stomata, eye, and heart"
  ```

---

### Task 3: Interactive Physics-NN Panel & Voice Guide UI

**Files:**
- Create: `frontend/src/features/three-lab/physics-nn/PhysicsNnPanel.tsx`

**Interfaces:**
- Consumes:
  - `PinnEvaluation` from Task 2
  - `voiceNarrator` and `BIO_SCRIPTS` from Task 1
- Produces:
  - `export const PhysicsNnPanel: React.FC<PhysicsNnPanelProps>;`

- [ ] **Step 1: Build `PhysicsNnPanel.tsx`**
  - Section 1: Dr. Bio Voice Guide card with Play/Pause audio narrator, volume toggle, live subtitle bar, and "What am I looking at?" kid summary.
  - Section 2: Real-time Physics Neural Network Brain card with animated SVG neural network node connections, live Data Loss vs Physics Loss meters, and real-time physical prediction badges.
  - Section 3: Interactive 5th-grade Science Insight card with fun-facts and ICSE exam tips.

- [ ] **Step 2: Verify component build**
  Run: `npm run build` in `frontend`
  Expected: PASS with 0 errors.

- [ ] **Step 3: Commit**
  ```bash
  git add frontend/src/features/three-lab/physics-nn/PhysicsNnPanel.tsx
  git commit -m "feat(three-lab): build PhysicsNnPanel with live AI neural graph and Dr. Bio audio guide"
  ```

---

### Task 4: High-Fidelity Realistic Stomata 3D Scene

**Files:**
- Modify: `frontend/src/features/three-lab/scenes/StomataScene.tsx`

**Interfaces:**
- Consumes:
  - `turgorPressure: number`, `kIonConcentration: number`, `lightCondition: 'day'|'night'|'drought'`
  - `onSelectPart?: (partName: string) => void`

- [ ] **Step 1: Upgrade Stomata 3D Anatomy**
  - Replace generic cylinders with smooth, kidney bean-shaped guard cells using contoured CatmullRom splines and tube geometry.
  - Model thick inelastic inner cellulose walls (dark green, dense material) and thin flexible outer walls (translucent vibrant green).
  - Add 3D chloroplast spheres embedded in the cytoplasm, central vacuoles that expand with turgor, and cell nuclei.
  - Add surrounding jigsaw-patterned epidermal pavement cells.
  - Add potassium ion ($K^+$) particle influx animation.

- [ ] **Step 2: Test interactivity and camera lighting**
  Ensure smooth aperture opening/closing tied to turgor and PINN calculations with interactive part selection.

- [ ] **Step 3: Verify build**
  Run: `npm run build` in `frontend`
  Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**
  ```bash
  git add frontend/src/features/three-lab/scenes/StomataScene.tsx
  git commit -m "feat(three-lab): upgrade StomataScene with realistic guard cells, chloroplasts, and vacuoles"
  ```

---

### Task 5: High-Fidelity Realistic Human Eye 3D Scene with Ray Optics

**Files:**
- Modify: `frontend/src/features/three-lab/scenes/EyeDefectScene.tsx`

**Interfaces:**
- Consumes:
  - `visionMode: 'normal'|'myopia'|'myopia_corrected'|'hyperopia'|'hyperopia_corrected'`
  - `accommodation: number`
  - `onSelectPart?: (partName: string) => void`

- [ ] **Step 1: Upgrade Eye 3D Anatomy & Cross-Section**
  - Build multi-layered anatomical sagittal cross-section: Sclera (outer white coat), Choroid (vascular layer), Retina (sensory coat with Fovea and Optic Nerve stem).
  - Add transparent curved Cornea dome, colored Iris disk with responsive Pupil aperture, and Ciliary body with delicate fibrous suspensory zonule ligaments.
  - Model flexible biconvex Crystalline Lens that thickens with accommodation.
  - Add dynamic optical ray-tracing light beams showing exact refraction at the cornea and lens, converging either directly on the retina (normal), in front (myopia), or behind (hyperopia).
  - Render concave or convex corrective glasses lens in corrected modes.

- [ ] **Step 2: Verify build**
  Run: `npm run build` in `frontend`
  Expected: PASS with 0 errors.

- [ ] **Step 3: Commit**
  ```bash
  git add frontend/src/features/three-lab/scenes/EyeDefectScene.tsx
  git commit -m "feat(three-lab): upgrade EyeDefectScene with realistic sagittal anatomy and ray-tracing optics"
  ```

---

### Task 6: High-Fidelity Realistic 4-Chamber Heart 3D Scene

**Files:**
- Modify: `frontend/src/features/three-lab/scenes/HeartScene.tsx`

**Interfaces:**
- Consumes:
  - `heartRate: number`, `isPumping: boolean`, `bloodFlowSpeed: number`
  - `activeChamber?: string | null`
  - `onSelectChamber?: (chamber: string) => void`

- [ ] **Step 1: Upgrade Heart 3D Anatomy**
  - Build realistic coronal cutaway of all 4 chambers: Right Atrium (blue), Right Ventricle (blue), Left Atrium (red), and Left Ventricle with thick muscular myocardium (deep red).
  - Add Tricuspid Valve with 3 cusps anchored to papillary muscles by fibrous chordae tendineae ("heart strings"); add Bicuspid/Mitral Valve with 2 cusps.
  - Add Aorta arch with 3 distinct branch vessels (brachiocephalic, common carotid, subclavian), Pulmonary Trunk & arteries, Superior and Inferior Vena Cava, and Interventricular Septum.
  - Add pulsing dual-phase cardiac cycle (atrial systole $\rightarrow$ ventricular systole $\rightarrow$ diastole) with red and blue circulating blood corpuscle particles.

- [ ] **Step 2: Verify build**
  Run: `npm run build` in `frontend`
  Expected: PASS with 0 errors.

- [ ] **Step 3: Commit**
  ```bash
  git add frontend/src/features/three-lab/scenes/HeartScene.tsx
  git commit -m "feat(three-lab): upgrade HeartScene with 4-chamber coronal anatomy, valves, and aorta arch"
  ```

---

### Task 7: Dual-Panel Integration in `ThreeLab.tsx` & End-to-End Polish

**Files:**
- Modify: `frontend/src/features/three-lab/ThreeLab.tsx`

**Interfaces:**
- Integrates:
  - Upgraded 3D Scenes (`HeartScene`, `EyeDefectScene`, `StomataScene`)
  - `PhysicsNnPanel` and `voiceNarrator`

- [ ] **Step 1: Re-architect `ThreeLab.tsx` into responsive Dual-Lab Layout**
  - Left panel: 3D interactive viewport with zoom/rotate controls, fullscreen toggle, reset, and component inspection badges.
  - Right panel: Physics-NN dashboard with live loss curves, physical law equations, Dr. Bio audio guide, and parameter sliders.
  - Connect organ selection to Dr. Bio audio component tags so clicking "Cornea" or "Tricuspid Valve" plays the corresponding fun fact.

- [ ] **Step 2: Run complete lint and build verification**
  Run: `npm run lint` and `npm run build` in `frontend`
  Expected: PASS with 0 errors.

- [ ] **Step 3: Commit**
  ```bash
  git add frontend/src/features/three-lab/ThreeLab.tsx
  git commit -m "feat(three-lab): integrate dual-panel layout with realistic 3D scenes, Physics-NN, and audio narrator"
  ```
