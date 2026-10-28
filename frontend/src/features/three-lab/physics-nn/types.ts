export interface PinnEvaluation {
  dataLoss: number;
  physicsLoss: number;
  totalLoss: number;
  predictions: Record<string, number>;
  predictionLabels: Record<
    string,
    {
      label: string;
      unit: string;
      formula: string;
      kidExplanation: string;
    }
  >;
  activeWeights: number[][]; // Normalized weights for neural network graph animation
  inferenceTimeMs: number;
  physicsResidualFormula: string;
  physicsResidualValue: number;
}
