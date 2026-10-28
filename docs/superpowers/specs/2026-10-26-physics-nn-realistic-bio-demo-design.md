# Design Specification: 5th-Grade Realistic 3D Biology Lab with Physics-Informed Neural Network (PINN) & Voice-Over

**Document Path:** `docs/superpowers/specs/2026-10-26-physics-nn-realistic-bio-demo-design.md`  
**Date:** 2026-10-26  
**Status:** Brainstorming / Spec Phase  
**Target Audience:** 5th Grade Students (ICSE / General Science) + Educators  

---

## 1. Intent & The "Why"

The goal is to transform the existing 3D Biology Laboratory (`ThreeLab.tsx`) from a collection of stylized geometric primitives into a high-impact, realistic interactive educational simulator suitable for 5th graders. 

Kids learn best when they can:
1. **See realistic, beautiful organ anatomy** that matches authentic scientific diagrams (kidney-bean guard cells with chloroplasts and vacuoles, horizontal eye cross-section with cornea, lens, ciliary muscles and retina, 4-chambered heart with valves, chordae tendineae, and aorta branches).
2. **Hear a friendly, enthusiastic audio narrator ("Dr. Bio")** explaining biological phenomena through intuitive real-world metaphors (e.g., "The eye is your body's camera!", "Guard cells are tiny plant lips breathing!", "The heart is a dual-pump superhero!").
3. **Interact with a real-time Physics-Informed Neural Network (Physics-NN / PINN)** that learns and predicts physical laws (osmotic pressure in guard cells, Snell's law and focal convergence in the eye, Navier-Stokes hemodynamics and pressure-volume loops in the heart).

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **High-Fidelity 3D Anatomical Morphology:**
  - **Stomata:** Two realistic kidney-shaped guard cells, thick inelastic inner cellulose walls, thin elastic outer walls, chloroplasts, large central vacuoles, nucleus, and surrounding jigsaw epidermal cells.
  - **Human Eye:** Cornea, colored iris, pupil aperture, biconvex crystalline lens with accommodation flex, ciliary body & suspensory ligaments, vitreous body, retina, fovea, optic nerve, and ray-tracing light beams with focal convergence.
  - **Human Heart:** Coronal interior cross-section showing Right Atrium, Tricuspid Valve (with chordae tendineae and papillary muscles), Right Ventricle, Pulmonary Valve & Artery, Left Atrium, Mitral/Bicuspid Valve (with chordae tendineae), Left Ventricle with thick muscular wall (myocardium), Aortic Valve, Aorta with 3 arch branches, and superior/inferior vena cava, with rhythmic pumping and circulating blood corpuscles.
- **Split-Screen Dual Lab Layout (Option B):**
  - Left panel (60% width): Interactive Three.js 3D viewport with rotation, zoom, cross-section toggles, and organ part inspection tags.
  - Right panel (40% width): Interactive Physics-NN Engine (live AI weights, physics loss vs data loss, real-time prediction readouts) + Voice-Over Guide ("Dr. Bio" audio controller with play/pause, kid-friendly transcript, and parameter sliders).
- **Client-Side Physics-NN (PINN) Engine:**
  - Lightweight, fast TypeScript implementation of Physics-Informed Neural Network forward inference with real-time gradient loss display.
  - Stomata PINN: Models van 't Hoff osmotic pressure $\Delta P = \Pi - \sigma$ and predicts pore aperture diameter ($\mu m$) and guard cell curvature.
  - Eye Optics PINN: Models Snell's law & Lensmaker equation $\frac{1}{f} = (n-1)(\frac{1}{R_1} - \frac{1}{R_2})$ and predicts focal length $f$, focal point on retina, and refractive error for myopia/hyperopia.
  - Heart Hemodynamics PINN: Models Poiseuille/Navier-Stokes blood pressure-flow $Q = \frac{\Delta P}{R}$ and predicts systolic/diastolic chamber pressures, stroke volume, and cardiac output.
- **Child-Friendly Voice-Over Narrator:**
  - Uses browser Web Speech API (`SpeechSynthesis`) with pitch and speed configured for an upbeat, friendly teacher voice.
  - Interactive transcript with live captioning bar and "Read aloud" buttons for each organ component.

### Non-Goals
- No heavy server-side Python/PyTorch cluster (inference and physics evaluations must run in-browser at 60 FPS without server latency or GPU dependencies).
- No complex surgical procedures or microscopic cell histology outside the 5th-grade curriculum.

### Anti-Goals
- **No boring formula walls:** Avoid displaying dry calculus without visual graphs, physical sliders, and intuitive analogies.
- **No static flat diagrams:** Everything in the 3D viewport must respond dynamically to slider changes and user clicks.
- **No robotic speech:** Voice narration must have proper sentence breaks, cheerful tone, and accompanying visual caption highlights.

---

## 3. System Architecture & Components

```
frontend/src/features/three-lab/
├── ThreeLab.tsx                         # Main dual-panel lab coordinator
├── audio/
│   ├── voiceNarrator.ts                 # Web Speech API controller with pitch/rate tuning
│   └── scriptData.ts                    # 5th-grade narration scripts per organ & state
├── physics-nn/
│   ├── types.ts                         # PINN state, loss, prediction interfaces
│   ├── stomataPinn.ts                   # Osmotic turgor PINN solver
│   ├── eyeOpticsPinn.ts                 # Optical ray refraction PINN solver
│   ├── hemodynamicsPinn.ts              # Cardiac hemodynamics PINN solver
│   └── PhysicsNnPanel.tsx               # UI component: Loss curves, AI brain graph, predictions
└── scenes/
    ├── StomataScene.tsx                 # Enhanced realistic stomatal apparatus
    ├── EyeDefectScene.tsx               # Enhanced realistic eye with optical ray tracing
    ├── HeartScene.tsx                   # Enhanced realistic 4-chamber heart with valves & blood
    ├── NephronScene.tsx                 # Existing scene preserved
    └── DnaHelixScene.tsx                # Existing scene preserved
```

---

## 4. Detailed Scene Specifications

### 4.1 Stomata Scene (`StomataScene.tsx`)
- **Realistic Geometry:**
  - Guard Cells: Extruded kidney-bean/crescent splines with rounded cross-sections.
  - Wall Differential: Inner wall constructed with dense dark-green inelastic cellulose microfibril band; outer wall made of translucent lighter green flexible mesh.
  - Organelles: 6-8 green chloroplast spheres embedded in each guard cell cytoplasm; visible central vacuole that inflates when turgid and deflates when flaccid; circular amber nucleus.
  - Epidermis: Tiled irregular jigsaw-puzzle epidermal cells encircling the guard cells.
- **Dynamic Physics NN Interaction:**
  - Sliders: Sunlight intensity (Day/Night), Soil Water Availability (0-100%), Potassium ($K^+$) Ion Pump.
  - PINN Predicts: Osmotic potential $\Pi$, Turgor pressure $P$, Stomatal pore width ($0$ to $12\mu m$), Transpiration rate ($mmol/m^2s$).
  - Voice-Over: Explains how sun causes $K^+$ ions to rush in, water follows by osmosis, and the thick inner wall forces the cells to curve outward like a smile.

### 4.2 Eye Defect & Optics Scene (`EyeDefectScene.tsx`)
- **Realistic Geometry:**
  - Eyeball Coat: Sclera (outer white protective layer) sliced open in sagittal section; Choroid (middle vascular layer); Retina (inner amber layer) leading to the Optic Nerve exit.
  - Anterior Segment: Curved transparent Cornea bulge; pigmented Iris with adjustable circular pupil; Ciliary body with delicate fibrous suspensory zonule ligaments.
  - Flexible Lens: Biconvex crystalline lens with adjustable curvature and thickness controlled by accommodation.
  - Ray Tracing: 3-5 yellow incident light rays originating from an object, refracting at the cornea, passing through pupil, refracting through the crystalline lens, and converging at the focal point.
  - Vision Modes: Normal (focus exactly on Fovea), Myopia (long eyeball, rays cross before retina; concave lens corrects), Hyperopia (short eyeball, rays hit behind retina; convex lens corrects).
- **Dynamic Physics NN Interaction:**
  - Sliders: Object Distance ($cm$), Eyeball Axial Length ($mm$), Ciliary Muscle Tension (Accommodation %).
  - PINN Predicts: Focal length $f$, Lens Optical Power ($D$, diopters), Image blur circle diameter on retina ($mm$), Recommended corrective glass prescription ($D$).
  - Voice-Over: Explains the eye as a living camera, why people need glasses, and how lenses bend light like magic prisms.

### 4.3 Heart Circulation Scene (`HeartScene.tsx`)
- **Realistic Geometry:**
  - 4 Distinct Chambers: Right Atrium (blue deoxygenated), Right Ventricle (blue deoxygenated), Left Atrium (red oxygenated), Left Ventricle (thick red muscular myocardium).
  - Great Vessels: Superior and Inferior Vena Cava entering RA; Pulmonary Trunk branching to left and right pulmonary arteries; Pulmonary Veins entering LA; Ascending Aorta with aortic arch and 3 branch vessels (brachiocephalic, common carotid, subclavian).
  - Valves & Structures: Tricuspid valve with 3 cusps anchored to papillary muscles via fibrous chordae tendineae ("heart strings"); Bicuspid/Mitral valve with 2 cusps anchored similarly; Aortic and Pulmonary semilunar valves.
  - Interventricular Septum: Thick central muscular wall preventing blood mixing.
  - Circulating Particles: Hemoglobin red blood cell particles streaming along accurate circulation paths with systolic pulsation.
- **Dynamic Physics NN Interaction:**
  - Sliders: Heart Rate ($bpm$), Exercise Intensity (Rest to Sprint), Peripheral Resistance ($mmHg \cdot s / L$).
  - PINN Predicts: Left Ventricular Peak Pressure ($mmHg$), Stroke Volume ($mL$), Cardiac Output ($L/min$), Wall Stress / Myocardial Workload.
  - Voice-Over: Explains the "lub-dub" heartbeat sounds created by the valves snapping shut, and how the muscular left ventricle sends oxygen to muscles during running.

---

## 5. Physics-Informed Neural Network (PINN) Technical Architecture

The in-browser PINN simulates how an AI learns physical biological laws:
1. **Model Representation:** A lightweight Multi-Layer Perceptron (3 inputs $\rightarrow$ 16 hidden nodes $\rightarrow$ 16 hidden nodes $\rightarrow$ 3 physical outputs) with analytic weights and real-time evaluation.
2. **Loss Function Decomposition:**
   $$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{data}} + \lambda_{\text{phys}} \mathcal{L}_{\text{physics}}$$
   - $\mathcal{L}_{\text{physics}}$ penalizes violations of biological laws:
     - Stomata: Volume conservation and elastic hoop strain equilibrium.
     - Eye: Fermat's principle of least time & Snell's law refraction matching.
     - Heart: Conservation of mass ($Q_{\text{in}} = Q_{\text{out}}$) and Poiseuille pressure drop.
3. **Interactive Panel:**
   - Displays real-time Physics Residual error, Neural Network inference speed ($<1\text{ms}$), predicted values vs ground-truth physics formulas, and animated neuron activation connections.

---

## 6. Voice-Over Audio Architecture ("Dr. Bio")

1. **Engine:** Native `window.speechSynthesis` with `SpeechSynthesisUtterance`.
2. **Voice Tuning:**
   - Rate: $0.95$ (clear, comfortable pacing for children).
   - Pitch: $1.15$ (warm, engaging, friendly).
   - Volume: $1.0$ with mute/unmute toggle.
3. **Interactive Controls:**
   - Global Play / Pause / Replay narrator button.
   - Component-level audio tags: Clicking on "Cornea", "Tricuspid Valve", or "Guard Cell" plays a 10-second fun-fact snippet.
   - Synchronized floating caption bar with high-contrast text and highlighting.

---

## 7. What is Left to the Builder

- Exact Three.js material shader values (shininess, roughness, opacity) to achieve maximum visual clarity and vibrancy.
- Fine-tuning the SVG/Canvas layout of the live PINN loss graph in `PhysicsNnPanel.tsx`.
- Fallback messaging for environments where Web Speech API is blocked or unavailable.
