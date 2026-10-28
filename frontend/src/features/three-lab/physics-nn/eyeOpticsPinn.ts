import type { PinnEvaluation } from './types';

export function evaluateEyeOpticsPinn(
  visionMode: 'normal' | 'myopia' | 'myopia_corrected' | 'hyperopia' | 'hyperopia_corrected',
  accommodationInput: number, // 0 - 100%
  objectDistanceCm: number = 50 // default 50cm object distance
): PinnEvaluation {
  const startTime = performance.now();

  const accomFraction = accommodationInput / 100.0;
  
  // Normal relaxed eye axial length = 24.0 mm
  // In Myopia: eyeball is elongated (e.g. 26.5 mm)
  // In Hyperopia: eyeball is short (e.g. 21.5 mm)
  let axialLengthMm = 24.0;
  if (visionMode === 'myopia' || visionMode === 'myopia_corrected') {
    axialLengthMm = 26.8;
  } else if (visionMode === 'hyperopia' || visionMode === 'hyperopia_corrected') {
    axialLengthMm = 21.6;
  }

  // Cornea power is fixed at ~43.0 Diopters
  const corneaPowerD = 43.0;
  // Crystalline lens power varies from ~19.0 D (relaxed) to ~29.0 D (maximum accommodation)
  const lensPowerD = 19.0 + accomFraction * 10.0;
  
  // Corrective spectacles contribution
  let correctivePowerDiopters = 0.0;
  if (visionMode === 'myopia_corrected') {
    // Needs concave lens (negative diopters) to push rays back
    correctivePowerDiopters = -2.75;
  } else if (visionMode === 'hyperopia_corrected') {
    // Needs convex lens (positive diopters) to bring rays forward
    correctivePowerDiopters = +2.50;
  }

  const totalEffectivePowerD = corneaPowerD + lensPowerD + correctivePowerDiopters;

  // Thin lens equation: 1/f = 1/v - 1/u  (Gaussian optics)
  // Object distance in meters (u is negative in sign convention)
  const uMeters = objectDistanceCm / 100.0;
  // Image convergence distance v = 1 / (Power - 1/u)
  const vMeters = 1.0 / (totalEffectivePowerD - 1.0 / uMeters);
  const retinalFocalDistanceMm = Number((vMeters * 1000.0).toFixed(2));

  // Blur circle diameter on retina:
  // blur = Pupil_Diameter * |v - axialLength| / v
  const pupilDiameterMm = 4.0;
  const blurCircleRadiusMm = Number(
    (Math.abs(retinalFocalDistanceMm - axialLengthMm) * (pupilDiameterMm / (2.0 * retinalFocalDistanceMm))).toFixed(3)
  );

  // Physics Loss: Snell's Law / Fermat principle residual
  // Residual = | 1/f - (1/v - 1/u) |
  const focalLengthMm = Number((1000.0 / totalEffectivePowerD).toFixed(2));
  const physicsResidual = Math.abs((1.0 / focalLengthMm) - (1.0 / retinalFocalDistanceMm + 1.0 / (objectDistanceCm * 10)));
  const physicsLoss = Number((physicsResidual * 0.15).toFixed(4));
  const dataLoss = Number((blurCircleRadiusMm * 0.05).toFixed(4));
  const totalLoss = Number((dataLoss + physicsLoss).toFixed(4));

  const layer1 = [
    [0.82 * (axialLengthMm / 24), 0.55 * accomFraction, 0.4 * (totalEffectivePowerD / 60)],
    [0.45 * (axialLengthMm / 24), 0.91 * (totalEffectivePowerD / 60), 0.65 * accomFraction],
    [0.73 * accomFraction, 0.62 * (axialLengthMm / 24), 0.88 * (totalEffectivePowerD / 60)],
    [0.91 * (totalEffectivePowerD / 60), 0.74 * accomFraction, 0.53 * (axialLengthMm / 24)]
  ];

  const inferenceTimeMs = Math.max(0.1, Number((performance.now() - startTime).toFixed(2)));

  return {
    dataLoss,
    physicsLoss,
    totalLoss,
    predictions: {
      focalLengthMm,
      retinalFocalDistanceMm,
      blurCircleRadiusMm,
      totalEffectivePowerD: Number(totalEffectivePowerD.toFixed(1)),
      correctivePowerDiopters
    },
    predictionLabels: {
      focalLengthMm: {
        label: 'System Focal Length',
        unit: 'mm',
        formula: 'f = \\frac{1}{D_{\\text{cornea}} + D_{\\text{lens}}}',
        kidExplanation: 'How close or far the eye lens focuses incoming light!'
      },
      retinalFocalDistanceMm: {
        label: 'Ray Convergence Point',
        unit: 'mm',
        formula: 'v = \\frac{1}{P - 1/u}',
        kidExplanation: 'Where the light rays actually cross inside the eyeball!'
      },
      blurCircleRadiusMm: {
        label: 'Retinal Blur Spot Size',
        unit: 'mm',
        formula: 'B = D_{\\text{pupil}} \\cdot \\frac{|v - L|}{2v}',
        kidExplanation: 'How blurry or fuzzy things look. 0 mm means crystal-clear HD focus!'
      },
      totalEffectivePowerD: {
        label: 'Total Optical Power',
        unit: 'Diopters (D)',
        formula: 'D = D_{\\text{cornea}} + D_{\\text{lens}}',
        kidExplanation: 'The magnifying power of your living camera lens!'
      },
      correctivePowerDiopters: {
        label: 'Glasses Prescription',
        unit: 'D',
        formula: 'P_{\\text{glass}} = \\frac{1}{L} - P_{\\text{eye}}',
        kidExplanation: 'The corrective lens power needed to fix blurry vision!'
      }
    },
    activeWeights: layer1,
    inferenceTimeMs,
    physicsResidualFormula: '|\\frac{1}{f} - (\\frac{1}{v} - \\frac{1}{u})|',
    physicsResidualValue: Number(physicsResidual.toFixed(4))
  };
}
