import type { PinnEvaluation } from './types';

export function evaluateStomataPinn(
  turgorInput: number, // 0 - 100%
  kIonInput: number,   // 0 - 100%
  lightCondition: 'day' | 'night' | 'drought'
): PinnEvaluation {
  const startTime = performance.now();

  // Environmental light factor: night & drought close stomata
  const lightFactor = lightCondition === 'night' ? 0.15 : lightCondition === 'drought' ? 0.05 : 1.0;
  
  // Guard cell osmotic potential (van 't Hoff equation): Pi = -i * C * R * T
  const effectiveKIon = (kIonInput / 100.0) * lightFactor;
  const effectiveTurgor = (turgorInput / 100.0) * lightFactor;

  // Physical calculation:
  // As K+ increases, osmotic draw brings water into vacuole.
  // Inelastic thick inner wall forces bean curvature: Aperture ~ alpha * (Turgor)^1.4
  const turgorPressureMPa = 0.2 + effectiveTurgor * 1.8 + effectiveKIon * 0.4; // 0.2 - 2.4 MPa
  
  // Neural Network forward prediction (simulated PINN inference):
  const rawPore = Math.max(0.1, Math.min(12.0, 11.5 * Math.pow(effectiveTurgor, 1.35) * Math.sqrt(Math.max(0.01, effectiveKIon))));
  const poreApertureMicrons = Number(rawPore.toFixed(2));
  
  // Transpiration flux: E = (g_s * VPD) / P_atm
  const transpirationRate = Number((poreApertureMicrons * 0.42 + 0.1).toFixed(2));
  
  // Cellulose hoop stress in thick inner microfibril wall (Young-Laplace relation)
  const hoopStressMPa = Number((turgorPressureMPa * 2.85).toFixed(2));

  // Physics loss: deviation from elastic beam bending equation
  // Residual: R_phys = Aperture - [ k_cellulose * (P_turgor - P_crit) ]
  const theoreticalAperture = Math.max(0, (turgorPressureMPa - 0.2) * 5.2);
  const physicsResidual = Math.abs(rawPore - theoreticalAperture);
  const physicsLoss = Number((physicsResidual * 0.08).toFixed(4));
  const dataLoss = Number((Math.abs(effectiveTurgor * 10 - rawPore) * 0.03).toFixed(4));
  const totalLoss = Number((dataLoss + physicsLoss).toFixed(4));

  // Dynamic network weights (3 inputs -> 4 hidden -> 4 hidden -> 3 outputs)
  const layer1 = [
    [0.72 * effectiveTurgor, 0.45 * effectiveKIon, 0.88 * lightFactor],
    [0.61 * effectiveKIon, 0.92 * effectiveTurgor, 0.35 * lightFactor],
    [0.44 * lightFactor, 0.81 * effectiveTurgor, 0.65 * effectiveKIon],
    [0.85 * effectiveTurgor, 0.52 * lightFactor, 0.77 * effectiveKIon]
  ];

  const inferenceTimeMs = Math.max(0.1, Number((performance.now() - startTime).toFixed(2)));

  return {
    dataLoss,
    physicsLoss,
    totalLoss,
    predictions: {
      poreApertureMicrons,
      turgorPressureMPa: Number(turgorPressureMPa.toFixed(2)),
      transpirationRate,
      hoopStressMPa
    },
    predictionLabels: {
      poreApertureMicrons: {
        label: 'Pore Opening Width',
        unit: 'µm',
        formula: 'W = \\alpha \\cdot P_{\\text{turgor}}^{1.35}',
        kidExplanation: 'How wide the plant lips are smiling open to breathe!'
      },
      turgorPressureMPa: {
        label: 'Vacuole Turgor Pressure',
        unit: 'MPa',
        formula: 'P = \\Pi_{\\text{in}} - \\Pi_{\\text{out}}',
        kidExplanation: 'How much water is puffed inside like a full water balloon!'
      },
      transpirationRate: {
        label: 'Water Evaporation Rate',
        unit: 'mmol/(m²·s)',
        formula: 'E = g_{\\text{stoma}} \\cdot \\Delta w',
        kidExplanation: 'How fast water vapor escapes into the air!'
      },
      hoopStressMPa: {
        label: 'Cellulose Wall Stress',
        unit: 'MPa',
        formula: '\\sigma = \\frac{P \\cdot r}{2t}',
        kidExplanation: 'The stretching tension on the tough inner microfibril belt!'
      }
    },
    activeWeights: layer1,
    inferenceTimeMs,
    physicsResidualFormula: '|W_{\\text{aperture}} - k_{\\text{beam}} \\cdot (P - P_0)|',
    physicsResidualValue: Number(physicsResidual.toFixed(3))
  };
}
