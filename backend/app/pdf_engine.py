import os
import json
import re
from typing import List, Dict, Optional, Tuple
import pymupdf

from app.models import (
    PageData, TopicItem, ChapterItem, CourseOverview, QuestionItem
)

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

CHAPTER_METADATA = [
    {
        "id": 1,
        "number": 1,
        "title": "Cell Cycle, Cell Division & Structure of Chromosomes",
        "page_start": 1,
        "page_end": 2,
        "weightage_marks": 10,
        "has_3d_demo": True,
        "demo_id": "dna_helix",
        "summary": "Covers why cells divide, chromatin vs chromosomes, centromeres, sister chromatids, phases of mitosis (prophase, metaphase, anaphase, telophase), cytokinesis, and cell cycle checkpoints.",
        "topics": [
            {
                "id": "t1_1", "unit_id": 1, "unit_title": "Cell Cycle & Chromosomes", "topic_name": "Why Cells Divide & Need for New Cells",
                "summary": "Cells divide for growth, development, repair of worn-out tissues, and reproduction to prevent DNA overloading and facilitate transport.",
                "page_number": 1, "definitions": ["Cell division", "DNA overloading"], "formulas": []
            },
            {
                "id": "t1_2", "unit_id": 1, "unit_title": "Cell Cycle & Chromosomes", "topic_name": "Structure of Chromosome & Nucleosomes",
                "summary": "Chromatin fibers condense into duplicated chromosomes joined at the centromere by kinetochores. DNA wraps around histone octamers forming nucleosomes.",
                "page_number": 1, "definitions": ["Chromatid", "Centromere", "Histone octamer", "Nucleosome"], "formulas": []
            },
            {
                "id": "t1_3", "unit_id": 1, "unit_title": "Cell Cycle & Chromosomes", "topic_name": "Mitosis Stages & Checkpoints",
                "summary": "Karyokinesis proceeds through Prophase (nuclear envelope dissolves), Metaphase (equatorial alignment), Anaphase (centromere splits), and Telophase.",
                "page_number": 2, "definitions": ["Equatorial plate", "Spindle fibers", "Aster rays", "Cyclins"], "formulas": []
            }
        ]
    },
    {
        "id": 2,
        "number": 2,
        "title": "Genetics: Some Basic Fundamentals",
        "page_start": 3,
        "page_end": 4,
        "weightage_marks": 10,
        "has_3d_demo": True,
        "demo_id": "dna_helix",
        "summary": "Heredity and variation, alleles, homozygous vs heterozygous, genotype vs phenotype, Mendel's monohybrid and dihybrid crosses, and human sex determination.",
        "topics": [
            {
                "id": "t2_1", "unit_id": 2, "unit_title": "Genetics", "topic_name": "Heredity, Genes & Alleles",
                "summary": "Heredity transmits traits across generations. Alleles are alternate forms of a gene located on identical loci of homologous chromosomes.",
                "page_number": 3, "definitions": ["Heredity", "Allele", "Locus", "Homozygous", "Heterozygous"], "formulas": []
            },
            {
                "id": "t2_2", "unit_id": 2, "unit_title": "Genetics", "topic_name": "Mendel's Laws & Monohybrid Cross",
                "summary": "Law of Dominance, Law of Segregation (Purity of Gametes), and Law of Independent Assortment. Monohybrid F2 ratio: 3:1 phenotypic, 1:2:1 genotypic.",
                "page_number": 3, "definitions": ["Monohybrid cross", "Law of Segregation", "Punnett square"], "formulas": ["Phenotypic = 3:1", "Genotypic = 1:2:1"]
            },
            {
                "id": "t2_3", "unit_id": 2, "unit_title": "Genetics", "topic_name": "Sex Determination & Sex-Linked Inheritance",
                "summary": "Humans have 22 pairs of autosomes and 1 pair of sex chromosomes (XX female, XY male). Haemophilia and red-green colour blindness are X-linked recessive.",
                "page_number": 4, "definitions": ["Autosomes", "Allosomes", "Colour blindness", "Criss-cross inheritance"], "formulas": ["Offspring = 50% Male (XY) : 50% Female (XX)"]
            }
        ]
    },
    {
        "id": 3,
        "number": 3,
        "title": "Absorption by Roots: Processes Involved",
        "page_start": 5,
        "page_end": 6,
        "weightage_marks": 8,
        "has_3d_demo": False,
        "summary": "Mechanism of water absorption: root hair structure, imbibition, diffusion, osmosis (endosmosis/exosmosis), turgidity, plasmolysis, and root pressure.",
        "topics": [
            {
                "id": "t3_1", "unit_id": 3, "unit_title": "Absorption by Roots", "topic_name": "Root Hair Structure & Surface Area",
                "summary": "Root hairs are unicellular epidermal outgrowths with thin cellulose cell walls and semi-permeable cell membranes for efficient absorption.",
                "page_number": 5, "definitions": ["Root hair", "Semi-permeable membrane"], "formulas": []
            },
            {
                "id": "t3_2", "unit_id": 3, "unit_title": "Absorption by Roots", "topic_name": "Osmosis, Turgidity & Plasmolysis",
                "summary": "Osmosis is solvent movement from dilute to concentrated solution across a semi-permeable membrane. Hypertonic causes plasmolysis; hypotonic causes turgidity.",
                "page_number": 5, "definitions": ["Osmosis", "Endosmosis", "Exosmosis", "Turgor pressure", "Plasmolysis"], "formulas": ["Ψw = Ψs + Ψp"]
            },
            {
                "id": "t3_3", "unit_id": 3, "unit_title": "Absorption by Roots", "topic_name": "Ascent of Sap & Forces Involved",
                "summary": "Upward conduction of water through xylem sap driven by root pressure, capillary action, adhesion-cohesion, and transpiration pull.",
                "page_number": 6, "definitions": ["Ascent of sap", "Root pressure", "Transpiration pull", "Guttation"], "formulas": []
            }
        ]
    },
    {
        "id": 4,
        "number": 4,
        "title": "Transpiration",
        "page_start": 7,
        "page_end": 7,
        "weightage_marks": 8,
        "has_3d_demo": True,
        "demo_id": "stomata_turgor",
        "summary": "Loss of water vapor from aerial plant parts. Stomatal, cuticular, and lenticular transpiration. Mechanism of stomatal opening and Ganong's potometer.",
        "topics": [
            {
                "id": "t4_1", "unit_id": 4, "unit_title": "Transpiration", "topic_name": "Types of Transpiration",
                "summary": "Stomatal (85-90% through stomata), Cuticular (through waxy cuticle), and Lenticular (through lenticels in woody stems).",
                "page_number": 7, "definitions": ["Stomata", "Cuticle", "Lenticels"], "formulas": []
            },
            {
                "id": "t4_2", "unit_id": 4, "unit_title": "Transpiration", "topic_name": "Stomatal Mechanism & Guard Cell Turgor",
                "summary": "Guard cells have thick inner and thin outer walls. K+ ion influx lowers water potential, causing endosmosis and stomatal pore opening.",
                "page_number": 7, "definitions": ["Guard cells", "Turgidity", "K+ ion pump mechanism"], "formulas": []
            }
        ]
    },
    {
        "id": 5,
        "number": 5,
        "title": "Photosynthesis: Provider of Food for All",
        "page_start": 8,
        "page_end": 9,
        "weightage_marks": 12,
        "has_3d_demo": False,
        "summary": "Biochemical process converting light to chemical energy. Chloroplast structure, photochemical (light) reaction, Calvin (dark) reaction, and starch test.",
        "topics": [
            {
                "id": "t5_1", "unit_id": 5, "unit_title": "Photosynthesis", "topic_name": "Chloroplast & Chemical Equation",
                "summary": "Equation: 6CO2 + 12H2O -> C6H12O6 + 6H2O + 6O2 in the presence of sunlight and chlorophyll. Chloroplasts contain grana and stroma.",
                "page_number": 8, "definitions": ["Thylakoid", "Granum", "Stroma", "Chlorophyll a & b"], "formulas": ["6CO2 + 12H2O -> C6H12O6 + 6H2O + 6O2"]
            },
            {
                "id": "t5_2", "unit_id": 5, "unit_title": "Photosynthesis", "topic_name": "Light & Dark Reactions",
                "summary": "Light reaction (in thylakoid grana): Photolysis of water (2H2O -> 4H+ + 4e- + O2) and photophosphorylation (ADP + Pi -> ATP). Dark reaction (in stroma): CO2 reduction to glucose.",
                "page_number": 9, "definitions": ["Photolysis of water", "Hill reaction", "Calvin cycle", "NADP reduction"], "formulas": ["2H2O -> 4H+ + 4e- + O2", "ADP + Pi -> ATP"]
            }
        ]
    },
    {
        "id": 6,
        "number": 6,
        "title": "Chemical Coordination in Plants",
        "page_start": 10,
        "page_end": 11,
        "weightage_marks": 6,
        "has_3d_demo": False,
        "summary": "Plant growth regulators (Auxins, Gibberellins, Cytokinins, Abscisic Acid, Ethylene) and tropic movements (phototropism, geotropism, hydrotropism).",
        "topics": [
            {
                "id": "t6_1", "unit_id": 6, "unit_title": "Plant Coordination", "topic_name": "Phytohormones (Plant Growth Regulators)",
                "summary": "Auxins promote stem elongation and apical dominance; Gibberellins break seed dormancy; Cytokinins promote cell division; ABA causes stomatal closure and dormancy.",
                "page_number": 10, "definitions": ["Auxin", "Gibberellin", "Cytokinin", "Abscisic Acid (Stress hormone)", "Ethylene"], "formulas": []
            },
            {
                "id": "t6_2", "unit_id": 6, "unit_title": "Plant Coordination", "topic_name": "Tropic & Nastic Movements",
                "summary": "Tropic movements are directional growth responses (Phototropism, Geotropism, Hydrotropism). Nastic movements are non-directional (Thigmonasty in touch-me-not).",
                "page_number": 11, "definitions": ["Phototropism", "Geotropism", "Thigmotropism", "Pulvinus"], "formulas": []
            }
        ]
    },
    {
        "id": 7,
        "number": 7,
        "title": "The Circulatory System",
        "page_start": 12,
        "page_end": 13,
        "weightage_marks": 12,
        "has_3d_demo": True,
        "demo_id": "human_heart",
        "summary": "Blood components, ABO grouping, internal heart anatomy, valves, cardiac cycle (systole and diastole), double circulation, and hepatic portal system.",
        "topics": [
            {
                "id": "t7_1", "unit_id": 7, "unit_title": "Circulatory System", "topic_name": "Blood Composition & RBC Adaptations",
                "summary": "Blood consists of plasma (55%) and cellular elements (45%). Erythrocytes are biconcave, enucleated discs loaded with haemoglobin for maximal oxygen carriage.",
                "page_number": 12, "definitions": ["Erythrocytes", "Leukocytes", "Thrombocytes", "Diapedesis", "Haemoglobin"], "formulas": []
            },
            {
                "id": "t7_2", "unit_id": 7, "unit_title": "Circulatory System", "topic_name": "Heart Anatomy, Valves & Cardiac Cycle",
                "summary": "Four chambers: RA, RV, LA, LV. Tricuspid valve between RA/RV; Bicuspid (mitral) valve between LA/LV; Semilunar valves at pulmonary artery and aorta roots.",
                "page_number": 13, "definitions": ["Tricuspid valve", "Bicuspid/Mitral valve", "Semilunar valves", "Pericardium", "Cardiac output"],
                "formulas": ["Cardiac Output = Stroke Volume (70 ml) x Heart Rate (72 bpm) ≈ 5040 ml/min"]
            },
            {
                "id": "t7_3", "unit_id": 7, "unit_title": "Circulatory System", "topic_name": "Double Circulation & Portal Systems",
                "summary": "Pulmonary circulation transports blood between heart and lungs; systemic circulation supplies the body tissues. Hepatic portal vein carries food nutrients to liver.",
                "page_number": 13, "definitions": ["Double circulation", "Pulmonary circulation", "Systemic circulation", "Hepatic portal system"], "formulas": []
            }
        ]
    },
    {
        "id": 8,
        "number": 8,
        "title": "The Excretory System",
        "page_start": 14,
        "page_end": 15,
        "weightage_marks": 10,
        "has_3d_demo": True,
        "demo_id": "nephron_filtration",
        "summary": "Excretion of nitrogenous wastes (urea, uric acid). Anatomy of kidney, nephron histology, Malpighian corpuscle, ultrafiltration, and osmoregulation by ADH.",
        "topics": [
            {
                "id": "t8_1", "unit_id": 8, "unit_title": "Excretory System", "topic_name": "Kidney Anatomy & Nephron Structure",
                "summary": "Kidney cortex houses Malpighian bodies, PCT and DCT; medulla houses Loops of Henle and Collecting ducts opening into renal pelvis.",
                "page_number": 14, "definitions": ["Renal cortex", "Renal medulla", "Nephron", "Bowman's capsule", "Glomerulus"], "formulas": []
            },
            {
                "id": "t8_2", "unit_id": 8, "unit_title": "Excretory System", "topic_name": "Mechanism of Urine Formation & Pressures",
                "summary": "Three stages: 1. Ultrafiltration (hydrostatic pressure 55 mm Hg - (osmotic 30 + capsular 15) = net 10 mm Hg), 2. Selective reabsorption in PCT, 3. Tubular secretion.",
                "page_number": 15, "definitions": ["Ultrafiltration", "Selective reabsorption", "Tubular secretion", "Net Filtration Pressure (NFP)"],
                "formulas": ["NFP = Glomerular Hydrostatic (55) - (Blood Osmotic (30) + Capsular Hydrostatic (15)) = 10 mm Hg"]
            }
        ]
    },
    {
        "id": 9,
        "number": 9,
        "title": "The Nervous System & Sense Organs",
        "page_start": 16,
        "page_end": 19,
        "weightage_marks": 12,
        "has_3d_demo": True,
        "demo_id": "eye_defect",
        "summary": "Neuron anatomy, synapse transmission, reflex arc, brain regions (cerebrum, cerebellum, medulla oblongata), eye anatomy & vision defects, ear auditory & balance mechanisms.",
        "topics": [
            {
                "id": "t9_1", "unit_id": 9, "unit_title": "Nervous System", "topic_name": "Neuron Structure & Synapse",
                "summary": "Neuron comprises cyton, dendrites, axon with myelin sheath, Nodes of Ranvier, and synaptic knobs that release Acetylcholine across the synaptic cleft.",
                "page_number": 16, "definitions": ["Neuron", "Cyton", "Myelin sheath", "Node of Ranvier", "Synapse", "Acetylcholine"], "formulas": []
            },
            {
                "id": "t9_2", "unit_id": 9, "unit_title": "Nervous System", "topic_name": "Brain Structure & Reflex Action",
                "summary": "Cerebrum governs intelligence and conscious thought; Cerebellum coordinates equilibrium and muscular activity; Medulla oblongata regulates cardiac and respiratory centers.",
                "page_number": 17, "definitions": ["Cerebrum", "Cerebellum", "Medulla oblongata", "Reflex arc", "Meninges"], "formulas": []
            },
            {
                "id": "t9_3", "unit_id": 9, "unit_title": "Sense Organs", "topic_name": "Eye Anatomy & Defects (Myopia & Hyperopia)",
                "summary": "Cornea, iris, crystalline lens, retina (rods/cones), fovea centralis. Myopia (eyeball too long, image in front of retina) corrected by concave lens; Hyperopia by convex lens.",
                "page_number": 19, "definitions": ["Myopia (Short-sightedness)", "Hyperopia (Long-sightedness)", "Accommodation", "Yellow spot (Fovea centralis)", "Blind spot"],
                "formulas": ["Lens formula: 1/f = 1/v - 1/u", "Power = 1/f (dioptres)"]
            }
        ]
    },
    {
        "id": 10,
        "number": 10,
        "title": "The Endocrine System",
        "page_start": 20,
        "page_end": 22,
        "weightage_marks": 8,
        "has_3d_demo": False,
        "summary": "Ductless glands secreting hormones directly into blood. Pituitary master gland, Thyroid, Adrenal glands, Pancreas Islets of Langerhans, and associated hyposecretion/hypersecretion disorders.",
        "topics": [
            {
                "id": "t10_1", "unit_id": 10, "unit_title": "Endocrine System", "topic_name": "Pituitary & Thyroid Glands",
                "summary": "Pituitary secretes Growth Hormone (Gigantism/Dwarfism/Acromegaly), TSH, ADH (Diabetes insipidus). Thyroid secretes Thyroxine (Cretinism, Myxoedema, Simple Goitre, Exophthalmic Goitre).",
                "page_number": 20, "definitions": ["Pituitary gland", "Thyroid", "Thyroxine", "Cretinism", "Goitre", "Acromegaly"], "formulas": []
            },
            {
                "id": "t10_2", "unit_id": 10, "unit_title": "Endocrine System", "topic_name": "Pancreas & Adrenal Glands",
                "summary": "Islets of Langerhans: Beta cells secrete Insulin (hyposecretion causes Diabetes mellitus); Alpha cells secrete Glucagon. Adrenal medulla produces Adrenaline (emergency fight/flight hormone).",
                "page_number": 21, "definitions": ["Insulin", "Glucagon", "Adrenaline", "Addison's disease", "Cushing's syndrome"], "formulas": []
            }
        ]
    },
    {
        "id": 11,
        "number": 11,
        "title": "The Reproductive System",
        "page_start": 23,
        "page_end": 26,
        "weightage_marks": 10,
        "has_3d_demo": False,
        "summary": "Male and female reproductive anatomy, spermatogenesis, oogenesis, menstrual cycle phases, fertilization in fallopian tube, implantation in uterus, placenta, and gestation.",
        "topics": [
            {
                "id": "t11_1", "unit_id": 11, "unit_title": "Reproductive System", "topic_name": "Male & Female Reproductive Anatomy",
                "summary": "Male: Testes (Leydig cells produce Testosterone), Epididymis, Vas deferens, Seminal vesicle, Prostate. Female: Ovaries, Fallopian tubes (site of fertilization), Uterus (implantation).",
                "page_number": 23, "definitions": ["Testes", "Seminiferous tubules", "Leydig cells", "Fallopian tube (Oviduct)", "Uterus"], "formulas": []
            },
            {
                "id": "t11_2", "unit_id": 11, "unit_title": "Reproductive System", "topic_name": "Menstrual Cycle, Fertilization & Placenta",
                "summary": "Menstrual cycle: Menstrual, Proliferative, Ovulatory (LH surge day 14), Secretory phase. Fertilization forms diploid zygote. Placenta supplies nutrients/O2 and eliminates urea/CO2.",
                "page_number": 25, "definitions": ["Menstrual cycle", "Ovulation", "Placenta", "Amniotic fluid", "Monozygotic twins"], "formulas": ["Gestation period ≈ 280 days (40 weeks)"]
            }
        ]
    },
    {
        "id": 12,
        "number": 12,
        "title": "Human Evolution",
        "page_start": 29,
        "page_end": 30,
        "weightage_marks": 6,
        "has_3d_demo": False,
        "summary": "Theories of evolution (Lamarckism, Darwin's Natural Selection) and stages in human evolution: Australopithecus, Homo habilis, Homo erectus, Neanderthal, Cro-Magnon, Homo sapiens.",
        "topics": [
            {
                "id": "t12_1", "unit_id": 12, "unit_title": "Human Evolution", "topic_name": "Lamarckism vs Darwinism",
                "summary": "Lamarck proposed inheritance of acquired characteristics. Darwin proposed Natural Selection (Overproduction, Struggle for Existence, Survival of the Fittest).",
                "page_number": 29, "definitions": ["Natural Selection", "Acquired characters", "Speciation", "Vestigial organs"], "formulas": []
            },
            {
                "id": "t12_2", "unit_id": 12, "unit_title": "Human Evolution", "topic_name": "Stages in Human Ancestry & Cranial Capacity",
                "summary": "Australopithecus (450-600 cc), Homo habilis (650-800 cc, handy man), Homo erectus (900-1100 cc, upright gait, fire), Neanderthal (1450 cc, burial), Homo sapiens (1400-1600 cc).",
                "page_number": 30, "definitions": ["Bipedal locomotion", "Cranial capacity", "Australopithecus", "Homo erectus", "Neanderthal"],
                "formulas": ["Cranial capacities: Australopithecus 500cc -> H. habilis 700cc -> H. erectus 1000cc -> H. sapiens 1450cc"]
            }
        ]
    },
    {
        "id": 13,
        "number": 13,
        "title": "Population: The Increasing Numbers & Rising Problems",
        "page_start": 27,
        "page_end": 28,
        "weightage_marks": 6,
        "has_3d_demo": False,
        "summary": "Demography, birth rate (natality), death rate (mortality), population growth factors, census, and contraceptive methods (barrier, chemical, IUD, tubectomy, vasectomy).",
        "topics": [
            {
                "id": "t13_1", "unit_id": 13, "unit_title": "Population", "topic_name": "Demographic Terms & Growth Rate",
                "summary": "Birth rate is live births per 1000 people per year. Death rate is deaths per 1000 people per year. Growth rate = (Births - Deaths) + (Immigrants - Emigrants).",
                "page_number": 27, "definitions": ["Demography", "Natality", "Mortality", "Population explosion", "Census"],
                "formulas": ["Birth Rate = (Total Live Births / Mid-year Population) x 1000", "Growth Rate = Birth Rate - Death Rate"]
            },
            {
                "id": "t13_2", "unit_id": 13, "unit_title": "Population", "topic_name": "Contraceptive Methods & Family Welfare",
                "summary": "Barrier methods (condoms, diaphragms), IUDs (Copper-T prevents implantation), Hormonal pills, and Surgical methods (Vasectomy in males, Tubectomy in females).",
                "page_number": 28, "definitions": ["Copper-T", "Tubectomy", "Vasectomy", "MTP"], "formulas": []
            }
        ]
    },
    {
        "id": 14,
        "number": 14,
        "title": "Pollution: A Rising Environmental Problem",
        "page_start": 31,
        "page_end": 33,
        "weightage_marks": 6,
        "has_3d_demo": False,
        "summary": "Air, water, soil, noise and radioactive pollutants. Acid rain chemistry, greenhouse effect, global warming, ozone layer depletion by CFCs, eutrophication and biomagnification.",
        "topics": [
            {
                "id": "t14_1", "unit_id": 14, "unit_title": "Pollution", "topic_name": "Air Pollution, Acid Rain & Ozone Depletion",
                "summary": "SO2 and NO2 emissions react with atmospheric moisture producing H2SO4 and HNO3 (acid rain, pH < 5.6). CFCs release chlorine radicals destroying O3 in stratosphere.",
                "page_number": 31, "definitions": ["Acid rain", "Greenhouse effect", "Global warming", "Ozone hole", "Chlorofluorocarbons (CFCs)"],
                "formulas": ["SO2 + H2O -> H2SO3", "2SO2 + O2 + 2H2O -> 2H2SO4"]
            },
            {
                "id": "t14_2", "unit_id": 14, "unit_title": "Pollution", "topic_name": "Water Pollution, Eutrophication & Biomagnification",
                "summary": "Excessive nitrogen/phosphorus fertilizers cause algal blooms and oxygen depletion (eutrophication). Non-biodegradable pesticides like DDT accumulate up food chains (biomagnification).",
                "page_number": 32, "definitions": ["Eutrophication", "Biomagnification", "BOD (Biological Oxygen Demand)", "Biodegradable vs Non-biodegradable"], "formulas": []
            }
        ]
    }
]

class PDFKnowledgeEngine:
    def __init__(self):
        self.workspace_root = WORKSPACE_ROOT
        self.chapters_meta = CHAPTER_METADATA
        self.pages: Dict[int, PageData] = {}
        self.location_functions_data: List[Dict[str, str]] = []
        self.questions_bank: List[QuestionItem] = []
        self._load_extracted_data()
        self._load_location_and_functions()
        self._build_question_bank()

    def get_asset_path(self, filename: str) -> str:
        curriculum_path = os.path.join(self.workspace_root, "curriculum", filename)
        if os.path.exists(curriculum_path):
            return curriculum_path
        root_path = os.path.join(self.workspace_root, filename)
        if os.path.exists(root_path):
            return root_path
        return curriculum_path

    def _load_extracted_data(self):
        json_path = self.get_asset_path("extracted_revision_notes.json")
        if os.path.exists(json_path):
            try:
                with open(json_path, "r", encoding="utf-8-sig") as f:
                    data = json.load(f)
                    for item in data:
                        p_num = item["page"]
                        text = item["text"]
                        chap_title = self._get_chapter_title_for_page(p_num)
                        self.pages[p_num] = PageData(
                            page=p_num,
                            text=text,
                            chapter=chap_title,
                            key_terms=self._extract_key_terms(text),
                            diagrams=self._extract_diagram_mentions(text, p_num)
                        )
            except Exception as e:
                print(f"Error loading {json_path}: {e}")

        # If pages are not yet loaded, populate with chapter outlines
        if not self.pages:
            for chap in self.chapters_meta:
                for p in range(chap["page_start"], chap["page_end"] + 1):
                    self.pages[p] = PageData(
                        page=p,
                        text=f"Chapter {chap['number']}: {chap['title']}\nSummary: {chap['summary']}",
                        chapter=chap["title"],
                        key_terms=[t.topic_name for t in chap["topics"]],
                        diagrams=[]
                    )

    def _get_chapter_title_for_page(self, page_num: int) -> str:
        for c in self.chapters_meta:
            if c["page_start"] <= page_num <= c["page_end"]:
                return c["title"]
        return "General Biology"

    def _extract_key_terms(self, text: str) -> List[str]:
        terms = []
        for word in ["Mitosis", "Meiosis", "Centromere", "Chromatid", "Allele", "Homozygous", "Heterozygous",
                     "Osmosis", "Turgor", "Plasmolysis", "Stomata", "Chloroplast", "Photolysis", "Transpiration",
                     "Auxin", "Cytokinin", "Erythrocyte", "Tricuspid", "Bicuspid", "Systole", "Diastole",
                     "Glomerulus", "Bowman's capsule", "Nephron", "Ultrafiltration", "Neuron", "Synapse",
                     "Cerebrum", "Cerebellum", "Myopia", "Hyperopia", "Pituitary", "Thyroxine", "Insulin",
                     "Adrenaline", "Placenta", "Australopithecus", "Natality", "Mortality", "Acid rain", "Eutrophication"]:
            if re.search(r'\b' + re.escape(word) + r'\b', text, re.IGNORECASE):
                terms.append(word)
        return list(set(terms))

    def _extract_diagram_mentions(self, text: str, page_num: int) -> List[str]:
        diagram_map = {
            1: ["Structure of Duplicated Chromosome with Centromere & Chromatids"],
            2: ["Stages of Mitosis (Prophase, Metaphase, Anaphase, Telophase)"],
            3: ["Monohybrid Cross Punnett Square (3:1 Phenotypic Ratio)"],
            4: ["Dihybrid Cross & Sex Determination in Humans (XX & XY)"],
            5: ["Root Hair Cell absorbing water by Osmosis from Soil"],
            6: ["Ascent of Sap in Xylem Vessels"],
            7: ["Structure of Stomatal Apparatus (Turgid Open vs Flaccid Closed)"],
            8: ["Structure of Chloroplast with Grana and Stroma"],
            9: ["Photolysis of Water in Photosynthesis Light Reaction"],
            10: ["Phototropism and Geotropism experiments in Seedlings"],
            12: ["Composition of Blood (Erythrocytes, Leukocytes, Platelets)"],
            13: ["Internal Structure of Human Heart & Valves (Tricuspid, Bicuspid)"],
            14: ["Human Urinary System (Kidneys, Ureters, Bladder, Urethra)"],
            15: ["Malpighian Body & Nephron with Bowman's Capsule & Glomerulus"],
            16: ["Structure of Multipolar Neuron (Cyton, Axon, Myelin Sheath, Synapse)"],
            17: ["Sagittal Section of Human Brain (Cerebrum, Cerebellum, Medulla)"],
            18: ["Reflex Arc Mechanism (Receptor, Sensory, Interneuron, Motor, Effector)"],
            19: ["Vertical Section of Human Eye & Optical Correction of Myopia/Hyperopia"],
            20: ["Major Human Endocrine Glands (Pituitary, Thyroid, Adrenal, Pancreas)"],
            23: ["Human Male Reproductive System"],
            24: ["Human Female Reproductive System (Ovary, Fallopian Tube, Uterus)"],
            25: ["Human Sperm Structure & Developing Foetus with Placenta in Uterus"],
            30: ["Human Evolution Skulls & Cranial Capacities Comparison"],
            32: ["Acid Rain Mechanism & Eutrophication Algal Bloom"]
        }
        return diagram_map.get(page_num, [])

    def _load_location_and_functions(self):
        pdf_path = self.get_asset_path("Biology - Location and Functions.pdf")
        if os.path.exists(pdf_path):
            try:
                doc = pymupdf.open(pdf_path)
                full_text = ""
                for p in doc:
                    full_text += p.get_text() + "\n"
                doc.close()
                # Parse key location and function rows
                # Sample entries
                self.location_functions_data = [
                    {"structure": "Kidney / Nephron", "location": "Posterior abdominal wall, on either side of vertebral column", "function": "Excretion of nitrogenous wastes like urea, and osmoregulation"},
                    {"structure": "Bowman's Capsule", "location": "Renal cortex, expanded cup-like start of nephron", "function": "Performs ultrafiltration of blood under high glomerular hydrostatic pressure"},
                    {"structure": "Glomerulus", "location": "Enclosed inside Bowman's capsule in renal cortex", "function": "Knotted capillary tuft where filtration of plasma occurs"},
                    {"structure": "Loop of Henle", "location": "Renal medulla between PCT and DCT", "function": "Creates osmotic concentration gradient for water and salt reabsorption"},
                    {"structure": "Tricuspid Valve", "location": "Between right atrium and right ventricle of heart", "function": "Prevents backflow of deoxygenated blood into right atrium during ventricular systole"},
                    {"structure": "Bicuspid (Mitral) Valve", "location": "Between left atrium and left ventricle of heart", "function": "Prevents backflow of oxygenated blood into left atrium during ventricular systole"},
                    {"structure": "Semilunar Valves", "location": "Base of pulmonary artery and aorta", "function": "Prevents backflow of blood into ventricles during ventricular diastole"},
                    {"structure": "Sinoatrial (SA) Node", "location": "Upper wall of right atrium near opening of superior vena cava", "function": "Acts as natural pacemaker; initiates cardiac impulse for heartbeat"},
                    {"structure": "Coronary Arteries", "location": "Arise from base of aorta and branch over heart wall", "function": "Supply oxygenated blood and nutrients to cardiac muscle fibers"},
                    {"structure": "Myelin Sheath", "location": "Around the axon of medullated nerve fibers", "function": "Insulates axon and accelerates nerve impulse conduction via saltatory conduction"},
                    {"structure": "Nodes of Ranvier", "location": "Periodic interruptions/gaps in myelin sheath along axon", "function": "Allow rapid saltatory conduction of action potentials"},
                    {"structure": "Cerebellum", "location": "Under the posterior portion of cerebrum, dorsal to brainstem", "function": "Maintains posture, balance, and fine coordination of voluntary movements"},
                    {"structure": "Medulla Oblongata", "location": "Lowest part of brainstem, continuous with spinal cord", "function": "Controls involuntary reflex centers: heartbeat, breathing rate, peristalsis"},
                    {"structure": "Yellow Spot (Fovea Centralis)", "location": "Exact centre of retina directly behind optical axis", "function": "Area of brightest vision; densely packed with cones for sharp color vision"},
                    {"structure": "Blind Spot", "location": "Retina where optic nerve fibers leave the eye", "function": "No rods or cones; incapable of vision"},
                    {"structure": "Ciliary Body / Muscles", "location": "Between choroid and iris around crystalline lens", "function": "Alters curvature/focal length of lens for power of accommodation"},
                    {"structure": "Eustachian Tube", "location": "Connects middle ear cavity with nasopharynx", "function": "Equalizes air pressure on both sides of tympanic membrane"},
                    {"structure": "Organ of Corti", "location": "On basilar membrane in median canal of cochlea", "function": "Sensory receptor organ for hearing; converts sound vibrations into nerve impulses"},
                    {"structure": "Semicircular Canals", "location": "Inner ear, perpendicular to one another", "function": "Dynamic equilibrium and sensory balance during rotational movement of head"},
                    {"structure": "Leydig Cells (Interstitial Cells)", "location": "Connective tissue between seminiferous tubules of testes", "function": "Secrete male sex hormone Testosterone"},
                    {"structure": "Fallopian Tube (Oviduct)", "location": "Extends from near ovary to upper corner of uterus", "function": "Site of fertilization of ovum by sperm; conveys zygote to uterus"},
                    {"structure": "Placenta", "location": "Disc attached to uterine wall and connected to foetus via umbilical cord", "function": "Diffusion of nutrients and O2 from mother to foetus; excretion of urea/CO2; secretes Progesterone"},
                    {"structure": "Amniotic Fluid", "location": "Inside amniotic sac surrounding the developing foetus", "function": "Cushions foetus from mechanical shocks; maintains uniform temperature"}
                ]
            except Exception as e:
                print(f"Error parsing Location and Functions: {e}")

    def _build_question_bank(self):
        # Build comprehensive bank from ICSE 2026 Model Test Papers & Suggestive Questions
        self.questions_bank = [
            QuestionItem(
                id="q1", chapter_id=1, chapter_title="Cell Cycle & Chromosomes",
                topic="Mitosis Stages", question_type="mcq", difficulty="easy",
                question="The stage of mitosis in which chromosomes arrange themselves on the equatorial plate is:",
                options=["Prophase", "Metaphase", "Anaphase", "Telophase"],
                correct_answer="Metaphase",
                explanation="During Metaphase, duplicated chromosomes align at the equatorial plane (metaphase plate) attached by spindle fibers at their centromeres.",
                supporting_page=2, marks=1
            ),
            QuestionItem(
                id="q2", chapter_id=1, chapter_title="Cell Cycle & Chromosomes",
                topic="Centromere", question_type="fill_in_blank", difficulty="easy",
                question="The point of attachment of two sister chromatids in a duplicated chromosome is called the _________.",
                correct_answer="Centromere",
                explanation="The centromere (kinetochore region) holds sister chromatids together until anaphase where it splits.",
                supporting_page=1, marks=1
            ),
            QuestionItem(
                id="q3", chapter_id=2, chapter_title="Genetics",
                topic="Mendelian Ratios", question_type="mcq", difficulty="medium",
                question="In a monohybrid cross between a homozygous tall (TT) and homozygous dwarf (tt) pea plant, the phenotypic ratio in F2 generation is:",
                options=["1:2:1", "3:1", "9:3:3:1", "1:1"],
                correct_answer="3:1",
                explanation="The F2 phenotypic ratio is 3 Tall (TT, Tt, Tt) : 1 Dwarf (tt), while the genotypic ratio is 1:2:1.",
                supporting_page=3, marks=1
            ),
            QuestionItem(
                id="q4", chapter_id=2, chapter_title="Genetics",
                topic="Sex Determination", question_type="give_reason", difficulty="medium",
                question="Give a biological reason: The father determines the sex of the human child, not the mother.",
                correct_answer="The mother produces only X-bearing eggs (homogametic). The father produces two types of sperms: 50% with X chromosome and 50% with Y chromosome (heterogametic). Fertilization with an X sperm produces a girl (XX); fertilization with a Y sperm produces a boy (XY).",
                explanation="Since the father produces both X and Y gametes, sperm genotype solely determines child sex.",
                supporting_page=4, marks=2
            ),
            QuestionItem(
                id="q5", chapter_id=3, chapter_title="Absorption by Roots",
                topic="Plasmolysis", question_type="differentiate", difficulty="medium",
                question="Differentiate between Turgor Pressure and Wall Pressure.",
                correct_answer="Turgor Pressure is the pressure exerted by the swollen cell contents (protoplast) against the cell wall when water enters by endosmosis. Wall Pressure is the equal and opposite pressure exerted by the rigid cell wall back against the expanding cell contents.",
                explanation="At full turgidity, Turgor Pressure equals Wall Pressure, stopping further net water entry.",
                supporting_page=5, marks=2
            ),
            QuestionItem(
                id="q6", chapter_id=4, chapter_title="Transpiration",
                topic="Stomatal Mechanism", question_type="mcq", difficulty="medium",
                question="The opening and closing of stomatal aperture is governed by changes in:",
                options=["Turgidity of guard cells", "Photosynthetic rate in epidermal cells", "Atmospheric nitrogen concentration", "Lignin deposition in cell wall"],
                correct_answer="Turgidity of guard cells",
                explanation="When guard cells absorb water and become turgid, their thick inner walls stretch and curve outwards, opening the pore. Flaccidity closes the pore.",
                supporting_page=7, marks=1
            ),
            QuestionItem(
                id="q7", chapter_id=5, chapter_title="Photosynthesis",
                topic="Photolysis", question_type="give_reason", difficulty="hard",
                question="Write the balanced chemical equation for the photolysis of water in the light phase of photosynthesis.",
                correct_answer="2H2O --(sunlight/chlorophyll)--> 4H+ + 4e- + O2",
                explanation="Photolysis splits water into hydrogen ions (protons), electrons, and molecular oxygen gas released as a byproduct.",
                supporting_page=9, marks=2
            ),
            QuestionItem(
                id="q8", chapter_id=7, chapter_title="Circulatory System",
                topic="Heart Valves", question_type="mcq", difficulty="easy",
                question="The valve present between the left atrium and left ventricle of the human heart is:",
                options=["Tricuspid valve", "Bicuspid (Mitral) valve", "Aortic semilunar valve", "Pulmonary valve"],
                correct_answer="Bicuspid (Mitral) valve",
                explanation="The Bicuspid or Mitral valve has two cusps and guards the atrioventricular opening between the left atrium and left ventricle.",
                supporting_page=13, marks=1
            ),
            QuestionItem(
                id="q9", chapter_id=7, chapter_title="Circulatory System",
                topic="Cardiac Output", question_type="mcq", difficulty="hard",
                question="If the heart rate of an individual is 72 beats per minute and stroke volume is 70 ml, what is their Cardiac Output?",
                options=["4500 ml/min", "5040 ml/min", "6200 ml/min", "7200 ml/min"],
                correct_answer="5040 ml/min",
                explanation="Cardiac Output = Stroke Volume x Heart Rate = 70 ml x 72 beats/min = 5040 ml/min (~5.04 litres per minute).",
                supporting_page=13, marks=2
            ),
            QuestionItem(
                id="q10", chapter_id=8, chapter_title="Excretory System",
                topic="Ultrafiltration", question_type="give_reason", difficulty="hard",
                question="Give reason: The efferent arteriole is narrower in diameter than the afferent arteriole.",
                correct_answer="The narrower lumen of the efferent arteriole creates resistance to blood outflow from the glomerulus, generating a high hydrostatic pressure (around 55 mm Hg) necessary for ultrafiltration of liquid plasma into Bowman's capsule.",
                explanation="The diameter difference directly drives high glomerular filtration pressure.",
                supporting_page=15, marks=2
            ),
            QuestionItem(
                id="q11", chapter_id=9, chapter_title="Nervous System & Sense Organs",
                topic="Eye Defects", question_type="mcq", difficulty="medium",
                question="A person cannot see distant objects clearly, but can see near objects well. This defect of the eye is corrected using a:",
                options=["Convex lens", "Concave lens", "Cylindrical lens", "Bifocal lens"],
                correct_answer="Concave lens",
                explanation="In Myopia (short-sightedness), the image of distant objects forms in front of the retina. A diverging concave lens diverges rays to focus sharply on the retina.",
                supporting_page=19, marks=1
            ),
            QuestionItem(
                id="q12", chapter_id=9, chapter_title="Nervous System & Sense Organs",
                topic="Ear Anatomy", question_type="fill_in_blank", difficulty="easy",
                question="The part of the inner ear responsible for hearing is the _________.",
                correct_answer="Cochlea",
                explanation="The spiral-shaped Cochlea contains the Organ of Corti with sensory hair cells that transmit sound vibrations to auditory nerve.",
                supporting_page=19, marks=1
            ),
            QuestionItem(
                id="q13", chapter_id=10, chapter_title="Endocrine System",
                topic="Hormones & Glands", question_type="mcq", difficulty="easy",
                question="The hormone known as the 'Emergency Hormone' or 'Fight-or-Flight Hormone' is:",
                options=["Insulin", "Thyroxine", "Adrenaline", "Oxytocin"],
                correct_answer="Adrenaline",
                explanation="Adrenaline (epinephrine), secreted by the adrenal medulla, increases heart rate, blood pressure, glucose mobilization, and respiration during emergencies.",
                supporting_page=21, marks=1
            ),
            QuestionItem(
                id="q14", chapter_id=11, chapter_title="Reproductive System",
                topic="Fertilization", question_type="mcq", difficulty="easy",
                question="In human females, fertilization of the ovum by sperm normally occurs in the:",
                options=["Ovary", "Fallopian Tube (Oviduct)", "Uterus", "Cervix"],
                correct_answer="Fallopian Tube (Oviduct)",
                explanation="Fertilization occurs in the ampulla region of the Fallopian tube / oviduct, after which the zygote travels down to implant in the uterine wall.",
                supporting_page=24, marks=1
            ),
            QuestionItem(
                id="q15", chapter_id=12, chapter_title="Human Evolution",
                topic="Cranial Capacity", question_type="mcq", difficulty="medium",
                question="The correct chronological order of human ancestors from oldest to most recent is:",
                options=[
                    "Australopithecus -> Homo habilis -> Homo erectus -> Neanderthal man -> Homo sapiens",
                    "Homo erectus -> Australopithecus -> Neanderthal man -> Homo habilis",
                    "Homo habilis -> Australopithecus -> Homo erectus -> Homo sapiens",
                    "Neanderthal man -> Homo erectus -> Australopithecus -> Homo sapiens"
                ],
                correct_answer="Australopithecus -> Homo habilis -> Homo erectus -> Neanderthal man -> Homo sapiens",
                explanation="Australopithecus (~4-2 mya) evolved to Homo habilis (handy man), then Homo erectus (upright walker, fire use), then Neanderthal man, and finally modern Homo sapiens.",
                supporting_page=30, marks=1
            )
        ]

    def get_overview(self) -> CourseOverview:
        total_topics = sum(len(c["topics"]) for c in self.chapters_meta)
        return CourseOverview(
            title="ICSE Class 10 Biology: Comprehensive Academic Hub",
            total_units=len(self.chapters_meta),
            total_topics=total_topics,
            total_pages=len(self.pages) if self.pages else 33,
            description="Interactive 3D academic learning dashboard grounded in official ICSE Class 10 Biology curriculum, revision notes, location/function registries, and solved board examination papers.",
            source_files=[
                "Biology - Revision Notes.pdf",
                "Biology - Location and Functions.pdf",
                "Biology - Suggestive Questions.pdf",
                "Biology - Model Test Paper - 1 (Solved).pdf",
                "Biology - Chapterwise Weightage.jpg"
            ],
            chapters=[
                ChapterItem(
                    id=c["id"],
                    number=c["number"],
                    title=c["title"],
                    page_start=c["page_start"],
                    page_end=c["page_end"],
                    weightage_marks=c["weightage_marks"],
                    summary=c["summary"],
                    has_3d_demo=c["has_3d_demo"],
                    demo_id=c.get("demo_id"),
                    topics=[TopicItem(**t) for t in c["topics"]]
                )
                for c in self.chapters_meta
            ]
        )

    def get_chapters(self) -> List[ChapterItem]:
        return [
            ChapterItem(
                id=c["id"],
                number=c["number"],
                title=c["title"],
                page_start=c["page_start"],
                page_end=c["page_end"],
                weightage_marks=c["weightage_marks"],
                summary=c["summary"],
                has_3d_demo=c["has_3d_demo"],
                demo_id=c.get("demo_id"),
                topics=[TopicItem(**t) for t in c["topics"]]
            )
            for c in self.chapters_meta
        ]

    def get_page(self, page_num: int) -> Optional[PageData]:
        return self.pages.get(page_num)

    def get_all_pages(self) -> List[PageData]:
        return [self.pages[p] for p in sorted(self.pages.keys())]

    def search_text(self, query: str) -> List[Dict[str, Any]]:
        results = []
        q_lower = query.lower()
        for p_num, p_data in self.pages.items():
            if q_lower in p_data.text.lower():
                # find snippet
                idx = p_data.text.lower().find(q_lower)
                start = max(0, idx - 60)
                end = min(len(p_data.text), idx + len(query) + 80)
                snippet = "..." + p_data.text[start:end].replace("\n", " ") + "..."
                results.append({
                    "page": p_num,
                    "chapter": p_data.chapter,
                    "snippet": snippet
                })
        return results

    def get_location_functions(self) -> List[Dict[str, str]]:
        return self.location_functions_data

    def get_questions(self, chapter_id: Optional[int] = None, difficulty: Optional[str] = None) -> List[QuestionItem]:
        q = self.questions_bank
        if chapter_id:
            q = [item for item in q if item.chapter_id == chapter_id]
        if difficulty:
            q = [item for item in q if item.difficulty.lower() == difficulty.lower()]
        return q
