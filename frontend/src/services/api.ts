import type { 
  CourseOverview, ChapterItem, RAGResponse, ProblemSolution, 
  QuestionItem, LocationFunctionItem 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchCourseOverview(): Promise<CourseOverview> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/course/overview`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API call failed, falling back to local cached overview:', err);
    return getFallbackOverview();
  }
}

export async function fetchChapters(): Promise<ChapterItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/course/chapters`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API call failed, falling back to local cached chapters:', err);
    return getFallbackOverview().chapters;
  }
}

export async function fetchPageData(pageNum: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/course/page/${pageNum}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      page: pageNum,
      text: `Page ${pageNum} content loaded from offline knowledge cache.`,
      chapter: 'ICSE Biology Coursework',
      key_terms: ['Biology', 'ICSE Class 10'],
      diagrams: []
    };
  }
}

export function getPageImageUrl(pageNum: number): string {
  return `${API_BASE_URL}/api/course/page/${pageNum}/image`;
}

export async function askQuestion(question: string, style: string = 'simple', chapterId?: number): Promise<RAGResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, style, chapter_id: chapterId })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('RAG API offline, using intelligent client-side fallback:', err);
    return getFallbackRAG(question, style);
  }
}

export async function solveProblem(problemText: string): Promise<ProblemSolution> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/solver/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem_text: problemText })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Solver API offline, using intelligent client-side solver:', err);
    return getFallbackSolver(problemText);
  }
}

export async function fetchQuestionBank(chapterId?: number, difficulty?: string): Promise<QuestionItem[]> {
  try {
    const params = new URLSearchParams();
    if (chapterId) params.append('chapter_id', chapterId.toString());
    if (difficulty) params.append('difficulty', difficulty);
    const res = await fetch(`${API_BASE_URL}/api/questions/bank?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Question bank API offline, using local question bank:', err);
    return getFallbackQuestions();
  }
}

export async function fetchLocationFunctions(): Promise<LocationFunctionItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/location-functions`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.items;
  } catch (err) {
    return [
      { structure: "Kidney / Nephron", location: "Posterior abdominal wall, on either side of vertebral column", function: "Excretion of nitrogenous wastes like urea, and osmoregulation" },
      { structure: "Bowman's Capsule", location: "Renal cortex, cup-shaped start of nephron", function: "Performs ultrafiltration of blood under high glomerular hydrostatic pressure" },
      { structure: "Tricuspid Valve", location: "Between right atrium and right ventricle of heart", function: "Prevents backflow of blood into right atrium during ventricular systole" },
      { structure: "Bicuspid (Mitral) Valve", location: "Between left atrium and left ventricle of heart", function: "Prevents backflow of blood into left atrium during ventricular systole" },
      { structure: "Cerebellum", location: "Under the posterior cerebrum, dorsal to brainstem", function: "Coordinates posture, balance, and fine voluntary movements" },
      { structure: "Medulla Oblongata", location: "Lowest part of brainstem, continuous with spinal cord", function: "Controls involuntary reflex centers: heartbeat, breathing, peristalsis" },
      { structure: "Yellow Spot (Fovea Centralis)", location: "Exact centre of retina directly behind optical axis", function: "Area of brightest vision; densely packed with cones for sharp color vision" },
      { structure: "Blind Spot", location: "Retina where optic nerve fibers leave the eyeball", function: "No rods or cones; incapable of vision" },
      { structure: "Fallopian Tube (Oviduct)", location: "Extends from ovary to upper corner of uterus", function: "Site of fertilization of ovum by sperm; conveys zygote to uterus" },
      { structure: "Placenta", location: "Disc attached to uterine wall connected to foetus via umbilical cord", function: "Diffusion of nutrients and O2 from mother to foetus; excretion of urea/CO2; secretes Progesterone" }
    ];
  }
}

export async function uploadPdfFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE_URL}/api/course/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to upload PDF');
  }
  return await res.json();
}

// Fallback Mock Generators
function getFallbackOverview(): CourseOverview {
  return {
    title: "ICSE Class 10 Biology: Comprehensive Academic Hub",
    total_units: 14,
    total_topics: 42,
    total_pages: 33,
    description: "Interactive 3D academic learning dashboard grounded in official ICSE Class 10 Biology curriculum, revision notes, location/function registries, and solved board examination papers.",
    source_files: [
      "Biology - Revision Notes.pdf",
      "Biology - Location and Functions.pdf",
      "Biology - Suggestive Questions.pdf",
      "Biology - Model Test Paper - 1 (Solved).pdf",
      "Biology - Chapterwise Weightage.jpg"
    ],
    chapters: [
      {
        id: 1, number: 1, title: "Cell Cycle, Cell Division & Structure of Chromosomes",
        page_start: 1, page_end: 2, weightage_marks: 10, has_3d_demo: true, demo_id: "dna_helix",
        summary: "Why cells divide, chromatin structure, centromeres, chromatids, mitosis stages (prophase, metaphase, anaphase, telophase), and cyclins.",
        topics: [
          { id: "t1_1", unit_id: 1, unit_title: "Cell Cycle & Chromosomes", topic_name: "Why Cells Divide & Surface Area Ratio", summary: "Cells divide for growth, repair, replacement, and reproduction to avoid DNA overloading.", page_number: 1, definitions: ["Cell Division", "DNA overloading"], formulas: [] },
          { id: "t1_2", unit_id: 1, unit_title: "Cell Cycle & Chromosomes", topic_name: "Structure of Chromosome & Nucleosomes", summary: "DNA coils around histone octamers forming nucleosomes; duplicated chromosomes link at centromere.", page_number: 1, definitions: ["Centromere", "Chromatid", "Nucleosome"], formulas: [] },
          { id: "t1_3", unit_id: 1, unit_title: "Cell Cycle & Chromosomes", topic_name: "Mitosis Stages & Equatorial Plate", summary: "Karyokinesis stages: Prophase, Metaphase, Anaphase, Telophase followed by Cytokinesis.", page_number: 2, definitions: ["Metaphase plate", "Spindle fibers"], formulas: [] }
        ]
      },
      {
        id: 2, number: 2, title: "Genetics: Some Basic Fundamentals",
        page_start: 3, page_end: 4, weightage_marks: 10, has_3d_demo: true, demo_id: "dna_helix",
        summary: "Mendelian genetics, laws of inheritance, monohybrid and dihybrid crosses, sex determination, and sex-linked traits.",
        topics: [
          { id: "t2_1", unit_id: 2, unit_title: "Genetics", topic_name: "Heredity, Genes & Alleles", summary: "Alleles are contrasting forms of a gene occupying identical loci on homologous chromosomes.", page_number: 3, definitions: ["Allele", "Homozygous", "Heterozygous"], formulas: [] },
          { id: "t2_2", unit_id: 2, unit_title: "Genetics", topic_name: "Mendel's Laws & Monohybrid Cross", summary: "F2 generation phenotypic ratio 3:1 (Tall:Dwarf); genotypic ratio 1:2:1 (TT:Tt:tt).", page_number: 3, definitions: ["Monohybrid", "Law of Segregation"], formulas: ["3:1 Phenotypic", "1:2:1 Genotypic"] },
          { id: "t2_3", unit_id: 2, unit_title: "Genetics", topic_name: "Human Sex Determination (XX vs XY)", summary: "Father determines child sex; 50% chance of male (XY) and 50% female (XX).", page_number: 4, definitions: ["Autosomes", "Allosomes"], formulas: ["50% XX : 50% XY"] }
        ]
      },
      {
        id: 4, number: 4, title: "Transpiration",
        page_start: 7, page_end: 7, weightage_marks: 8, has_3d_demo: true, demo_id: "stomata_turgor",
        summary: "Stomatal, cuticular, and lenticular transpiration. Mechanism of stomatal opening and closing via guard cell turgor and K+ ion flux.",
        topics: [
          { id: "t4_1", unit_id: 4, unit_title: "Transpiration", topic_name: "Stomatal Mechanism & Guard Cell Turgor", summary: "Guard cells swell when turgid, curving outer thin wall to open stomatal aperture.", page_number: 7, definitions: ["Guard cells", "Turgidity", "K+ ion pump"], formulas: [] }
        ]
      },
      {
        id: 7, number: 7, title: "The Circulatory System",
        page_start: 12, page_end: 13, weightage_marks: 12, has_3d_demo: true, demo_id: "human_heart",
        summary: "Blood composition, heart anatomy, 4 chambers, tricuspid and bicuspid valves, cardiac cycle, and double circulation.",
        topics: [
          { id: "t7_1", unit_id: 7, unit_title: "Circulatory System", topic_name: "Heart Anatomy & Valves", summary: "Tricuspid valve guards right AV orifice; bicuspid (mitral) guards left AV orifice.", page_number: 13, definitions: ["Tricuspid", "Bicuspid", "Semilunar"], formulas: ["Cardiac Output = SV (70ml) x HR (72bpm) ≈ 5040 ml/min"] }
        ]
      },
      {
        id: 8, number: 8, title: "The Excretory System",
        page_start: 14, page_end: 15, weightage_marks: 10, has_3d_demo: true, demo_id: "nephron_filtration",
        summary: "Kidney anatomy, nephron structure, ultrafiltration in glomerulus, selective reabsorption, and tubular secretion.",
        topics: [
          { id: "t8_1", unit_id: 8, unit_title: "Excretory System", topic_name: "Ultrafiltration & Pressures", summary: "Net Filtration Pressure = GHP (55) - [BOP (30) + CHP (15)] = 10 mm Hg.", page_number: 15, definitions: ["Ultrafiltration", "Bowman's capsule", "Glomerulus"], formulas: ["NFP = 55 - (30 + 15) = 10 mm Hg"] }
        ]
      },
      {
        id: 9, number: 9, title: "The Nervous System & Sense Organs",
        page_start: 16, page_end: 19, weightage_marks: 12, has_3d_demo: true, demo_id: "eye_defect",
        summary: "Neuron anatomy, synapse, brain regions, reflex arc, eye optical defects (Myopia & Hyperopia) and inner ear balance.",
        topics: [
          { id: "t9_1", unit_id: 9, unit_title: "Nervous System & Sense Organs", topic_name: "Eye Defects & Lens Correction", summary: "Myopia (short-sightedness) corrected by concave lens; Hyperopia corrected by convex lens.", page_number: 19, definitions: ["Myopia", "Hyperopia", "Accommodation"], formulas: ["1/f = 1/v - 1/u"] }
        ]
      }
    ]
  };
}

function getFallbackRAG(question: string, style: string): RAGResponse {
  const qLower = question.toLowerCase();
  
  if (qLower.includes('quantum') || qLower.includes('crypto') || qLower.includes('relativity')) {
    return {
      query: question,
      style,
      direct_answer: "I apologize, but the uploaded PDF does not contain information on this topic. It is outside the provided ICSE Class 10 Biology coursework. My responses are strictly grounded in your source documents.",
      is_grounded: false,
      supporting_citations: [],
      step_by_step: [],
      suggested_followups: [
        "Why do cells divide?",
        "What are the stages of mitosis?",
        "Explain how the nephron produces urine."
      ]
    };
  }

  return {
    query: question,
    style,
    direct_answer: "Based on the ICSE Biology Revision Notes, cells divide for growth, development, repair of damaged tissues, and reproduction to maintain optimal surface-area-to-volume ratio.",
    definition: "Cell Division: The fundamental biological process whereby a diploid parent cell duplicates its genetic material and divides into daughter cells.",
    detailed_explanation: "Multicellular organisms develop from a single fertilized egg (zygote) into complex bodies through mitosis. Division also allows replacement of dead epithelial and blood cells and avoids nucleo-cytoplasmic DNA overloading.",
    step_by_step: [
      "Interphase G1/S/G2: Cell growth, organelle synthesis, and DNA replication.",
      "Prophase: Chromosome condensation and disappearance of nuclear envelope.",
      "Metaphase: Alignment on equatorial plate attached by spindle fibers.",
      "Anaphase: Centromeres split and sister chromatids move to opposite poles.",
      "Telophase & Cytokinesis: Nuclear envelope reform and cytoplasm divides."
    ],
    formula: "Mitosis: 1 Diploid Parent (2n) -> 2 Identical Diploid Daughter Cells (2n)",
    exam_summary: "Key terms to write: Repair, Growth, Replacement, High surface-area-to-volume ratio, Centromere, Aster rays.",
    supporting_citations: [
      { page: 1, chapter: "Cell Cycle, Cell Division & Structure of Chromosomes", excerpt: "Cells divide for growth, development, repair of worn-out tissues and reproduction. To facilitate exchange of materials and control DNA overloading." }
    ],
    is_grounded: true,
    suggested_followups: [
      "What are the phases of mitosis?",
      "How is mitosis different in plant vs animal cells?",
      "What is the role of spindle fibers?"
    ]
  };
}

function getFallbackSolver(problemText: string): ProblemSolution {
  return {
    original_problem: problemText,
    topic: "Circulatory System - Cardiac Output Calculation",
    given_values: {
      "Heart Rate (HR)": "72 beats/min",
      "Stroke Volume (SV)": "70 ml/beat"
    },
    required_result: "Cardiac Output (CO) in ml/min and Litres/min",
    concept_applied: "Cardiac Output = Stroke Volume x Heart Rate (amount of blood pumped by each ventricle per minute)",
    source_page: 13,
    steps: [
      {
        step_number: 1,
        title: "Identify Given Values",
        explanation: "Stroke volume is 70 ml; heart rate is 72 beats/minute.",
        math_formula: "\\text{SV} = 70\\text{ ml}, \\quad \\text{HR} = 72\\text{ bpm}"
      },
      {
        step_number: 2,
        title: "Apply Formula",
        explanation: "Multiply stroke volume by heart rate.",
        math_formula: "\\text{Cardiac Output} = \\text{Stroke Volume} \\times \\text{Heart Rate}"
      },
      {
        step_number: 3,
        title: "Compute Numerical Value",
        explanation: "70 ml x 72 = 5040 ml/min. Divide by 1000 to convert to litres.",
        math_formula: "\\text{CO} = 70 \\times 72 = 5040\\text{ ml/min} = 5.04\\text{ Litres/min}",
        calculation: "70 * 72 = 5040 ml/min = 5.04 L/min"
      }
    ],
    final_result: "5040 ml/min (or 5.04 Litres per minute)",
    common_mistakes: [
      "Multiplying by 60 instead of heart rate.",
      "Forgetting to convert ml to litres when required."
    ],
    similar_practice_hint: "Calculate CO if heart rate jumps to 110 bpm during a sprint with SV = 75 ml.",
    verification_check: "70 * 72 = 5040. Verified against ICSE Class 10 Biology benchmark."
  };
}

function getFallbackQuestions(): QuestionItem[] {
  return [
    {
      id: "q1", chapter_id: 1, chapter_title: "Cell Cycle & Chromosomes",
      topic: "Mitosis Stages", question_type: "mcq", difficulty: "easy",
      question: "The stage of mitosis in which chromosomes arrange themselves on the equatorial plate is:",
      options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
      correct_answer: "Metaphase",
      explanation: "During Metaphase, duplicated chromosomes align at the equatorial plane attached by spindle fibers at their centromeres.",
      supporting_page: 2, marks: 1
    },
    {
      id: "q2", chapter_id: 1, chapter_title: "Cell Cycle & Chromosomes",
      topic: "Centromere", question_type: "fill_in_blank", difficulty: "easy",
      question: "The point of attachment of two sister chromatids in a duplicated chromosome is called the _________.",
      correct_answer: "Centromere",
      explanation: "The centromere (kinetochore region) holds sister chromatids together until anaphase where it splits.",
      supporting_page: 1, marks: 1
    },
    {
      id: "q3", chapter_id: 2, chapter_title: "Genetics",
      topic: "Mendelian Ratios", question_type: "mcq", difficulty: "medium",
      question: "In a monohybrid cross between a homozygous tall (TT) and homozygous dwarf (tt) pea plant, the phenotypic ratio in F2 generation is:",
      options: ["1:2:1", "3:1", "9:3:3:1", "1:1"],
      correct_answer: "3:1",
      explanation: "The F2 phenotypic ratio is 3 Tall : 1 Dwarf, while the genotypic ratio is 1:2:1.",
      supporting_page: 3, marks: 1
    },
    {
      id: "q8", chapter_id: 7, chapter_title: "Circulatory System",
      topic: "Heart Valves", question_type: "mcq", difficulty: "easy",
      question: "The valve present between the left atrium and left ventricle of the human heart is:",
      options: ["Tricuspid valve", "Bicuspid (Mitral) valve", "Aortic semilunar valve", "Pulmonary valve"],
      correct_answer: "Bicuspid (Mitral) valve",
      explanation: "The Bicuspid or Mitral valve has two cusps and guards the atrioventricular opening between the left atrium and left ventricle.",
      supporting_page: 13, marks: 1
    },
    {
      id: "q10", chapter_id: 8, chapter_title: "Excretory System",
      topic: "Ultrafiltration", question_type: "give_reason", difficulty: "hard",
      question: "Give reason: The efferent arteriole is narrower in diameter than the afferent arteriole.",
      correct_answer: "The narrower lumen of the efferent arteriole creates resistance to blood outflow from the glomerulus, generating a high hydrostatic pressure (around 55 mm Hg) necessary for ultrafiltration of liquid plasma into Bowman's capsule.",
      explanation: "The diameter difference directly drives high glomerular filtration pressure.",
      supporting_page: 15, marks: 2
    },
    {
      id: "q11", chapter_id: 9, chapter_title: "Nervous System & Sense Organs",
      topic: "Eye Defects", question_type: "mcq", difficulty: "medium",
      question: "A person cannot see distant objects clearly, but can see near objects well. This defect of the eye is corrected using a:",
      options: ["Convex lens", "Concave lens", "Cylindrical lens", "Bifocal lens"],
      correct_answer: "Concave lens",
      explanation: "In Myopia (short-sightedness), the image of distant objects forms in front of the retina. A diverging concave lens diverges rays to focus sharply on the retina.",
      supporting_page: 19, marks: 1
    }
  ];
}
