export interface OrganScript {
  title: string;
  intro: string;
  kidAnalogy: string;
  funFacts: Record<string, string>;
  physicsExplanation: string;
  componentDescriptions: Record<string, string>;
}

export const BIO_SCRIPTS: Record<string, OrganScript> = {
  stomata_turgor: {
    title: "Stomatal Guard Cells & Transpiration",
    intro: "Welcome to the leaf laboratory! These tiny kidney-bean shaped cells are called Guard Cells.",
    kidAnalogy: "Think of guard cells as tiny plant lips! When the plant is thirsty, the lips close tight to save water. When the sun shines and the plant drinks water, the lips puff up and pop open so the plant can breathe in carbon dioxide!",
    physicsExplanation: "Physics In Action: Water moves by Osmosis into the guard cells. Because the inner cell wall facing the pore is thick and inelastic, while the outer wall is thin and stretchy, increasing turgor pressure forces the cells to bow outward into a smile!",
    funFacts: {
      "Chloroplasts": "Guard cells are the only epidermal leaf cells that contain green chloroplasts to make sugar using sunlight!",
      "Vacuole": "The central vacuole is like a water balloon. When filled with water, it pushes against the cell wall with tremendous turgor pressure!",
      "Thick Inner Wall": "The inner wall has dense cellulose microfibril hoops. It acts like an iron belt, preventing the pore edge from stretching straight!",
      "Stomatal Pore": "Over 90% of water lost by plants evaporates out through these microscopic pores in a process called Transpiration!"
    },
    componentDescriptions: {
      "Guard Cells": "Two crescent-shaped cells that control the opening and closing of the stomatal pore.",
      "Stomatal Aperture": "The microscopic doorway that lets carbon dioxide in and water vapor out.",
      "Chloroplast": "Tiny green solar power plants that capture sunlight for photosynthesis.",
      "Thick Inner Wall": "Inelastic cellulose reinforcing strip that forces the bean to bow outward.",
      "Vacuole": "Fluid-filled internal reservoir controlling cell turgidity."
    }
  },
  eye_defect: {
    title: "Human Eye Optics & Vision Correction",
    intro: "Welcome to the optics vision suite! Your eye is nature's most advanced digital camera.",
    kidAnalogy: "Your eye is an organic zoom camera! Light enters through the clear cornea window, passes the pupil aperture, and is focused by the flexible crystalline lens like a magnifying glass directly onto the retina film at the back!",
    physicsExplanation: "Physics In Action: Light bends according to Snell's Law and the Lensmaker formula. In Myopia (nearsightedness), the eyeball is too long and light rays cross too early before reaching the retina. A concave lens spreads the rays out so they land perfectly on the fovea bullseye!",
    funFacts: {
      "Cornea": "The clear dome at the front does about 70% of the light bending before light even touches the inner lens!",
      "Crystalline Lens": "Your lens is flexible! Tiny ciliary muscles squeeze it to make it fat for reading books, or relax to make it flat for looking at stars!",
      "Retina & Fovea": "The retina has over 120 million light sensors! The tiny pit called the Fovea gives you ultra-sharp HD vision.",
      "Optic Nerve": "Sends visual electrical impulses to your brain at over 250 miles per hour!"
    },
    componentDescriptions: {
      "Cornea": "Transparent front dome that performs the initial refraction of incoming light rays.",
      "Iris & Pupil": "The colored aperture ring that widens in the dark and shrinks in bright light.",
      "Crystalline Lens": "Biconvex transparent lens that fine-tunes focal length onto the retina.",
      "Ciliary Muscle": "Ring of smooth muscle that contracts to change the curvature of the lens.",
      "Retina": "Light-sensitive photographic screen packed with photoreceptor rods and cones.",
      "Fovea": "The pinpoint center of sharpest focus and color vision.",
      "Optic Nerve": "The high-speed cable carrying visual data directly to the visual cortex in the brain."
    }
  },
  human_heart: {
    title: "Human Heart & 4-Chamber Circulation",
    intro: "Listen to that rhythm! You are looking inside a living 4-chamber human heart.",
    kidAnalogy: "Your heart is a dual-pump superhero about the size of your clenched fist! The right pump takes blue tired blood from your body and sends it to your lungs for fresh oxygen. The left pump is super strong and blasts bright red energized blood to your brain and toes!",
    physicsExplanation: "Physics In Action: Fluid dynamics and Poiseuille's law in motion! The muscular left ventricle generates high pressure (120 mmHg) to push blood through the systemic arteries. One-way valves with chordae tendineae prevent backward regurgitation!",
    funFacts: {
      "Left Ventricle": "Its muscular wall is three times thicker than the right side because it has to push blood all the way down to your toes and back!",
      "Heart Strings": "The chordae tendineae are tough fibrous chords that anchor the valve flaps like parachute cords so high pressure cannot blow them open backward!",
      "Lub-Dub Sound": "The 'lub' sound is the tricuspid and mitral valves snapping shut. The 'dub' sound is the aortic and pulmonary valves closing!",
      "Aorta": "The biggest blood highway in your body, arching up like a candy cane with three branch arteries feeding your arms and head!"
    },
    componentDescriptions: {
      "Right Atrium": "Receives deoxygenated blue blood returning from the upper and lower body.",
      "Right Ventricle": "Pumps deoxygenated blood through the pulmonary valve toward the lungs.",
      "Left Atrium": "Collects freshly oxygenated crimson blood from the pulmonary veins.",
      "Left Ventricle": "Powerful thick-walled chamber that ejects oxygenated blood into the aorta.",
      "Tricuspid Valve": "Three-flap valve between the right atrium and right ventricle.",
      "Bicuspid / Mitral Valve": "Two-flap valve between the left atrium and left ventricle.",
      "Chordae Tendineae": "Fibrous cords ('heart strings') anchoring valves to papillary muscles.",
      "Aorta": "Main systemic artery arching out of the left ventricle with 3 branching vessels."
    }
  },
  nephron_filtration: {
    title: "Nephron Ultrafiltration & Osmoregulation",
    intro: "Welcome to the kidney's microscopic filtering plant! Each kidney contains over one million nephrons.",
    kidAnalogy: "Nephrons are your body's ultra-purifying water filters! Blood enters under high pressure, dirty waste is squeezed out into the Bowman's capsule, and all the good water and vitamins are carefully reabsorbed back into the bloodstream!",
    physicsExplanation: "Physics In Action: Hydrostatic pressure in the glomerulus overcomes blood osmotic pressure to produce clean filtrate without losing large blood proteins.",
    funFacts: {
      "Glomerulus": "A microscopic knot of capillaries with tiny pores that filter about 180 liters of blood every single day!",
      "Loop of Henle": "Dips deep into the kidney to create a salt gradient that reclaims water.",
      "Collecting Duct": "Responds to ADH hormone to concentrate urine when you need to conserve water!"
    },
    componentDescriptions: {
      "Glomerulus": "High-pressure capillary filter bed.",
      "Bowman's Capsule": "Cup-shaped funnel capturing glomerular filtrate.",
      "Proximal Convoluted Tubule": "Reabsorbs glucose, amino acids, and essential salts."
    }
  },
  dna_helix: {
    title: "DNA Double Helix & Genetic Architecture",
    intro: "Step into the nucleus! You are looking at the double helix of deoxyribonucleic acid, the blueprint of life.",
    kidAnalogy: "DNA is like a twisted spiraling rope ladder! The ladder rungs are made of 4 puzzle pieces (A, T, C, G) that spell out the secret recipe to build you!",
    physicsExplanation: "Physics In Action: Hydrogen bonding between complementary base pairs (Adenine-Thymine, Cytosine-Guanine) stabilizes the thermodynamic double helix structure.",
    funFacts: {
      "Base Pairing": "Adenine always pairs with Thymine (2 hydrogen bonds), and Guanine always pairs with Cytosine (3 hydrogen bonds)!",
      "Length": "If you uncoiled all the DNA in just one of your human cells, it would stretch about 2 meters long!",
      "Histones": "DNA wraps around spool-like histone proteins to compact tightly into chromosomes."
    },
    componentDescriptions: {
      "Sugar-Phosphate Backbone": "The outer handrails of the DNA ladder made of alternating deoxyribose and phosphate.",
      "Base Pairs": "Nitrogenous base rungs (A-T and C-G) encoding genetic instructions.",
      "Major & Minor Grooves": "Spiral indentations where regulatory proteins bind to DNA."
    }
  }
};
