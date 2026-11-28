import { projectToSimplex } from "./simplex";
import type { FunDefinition, Ledger } from "./types";

const STEPS = 20000;
const STEP_SIZE = 0.01;
const PRECISION = 10000;

interface Sample {
  target: number;
  features: number[];
}

function samples(definition: FunDefinition, ledger: Ledger): Sample[] {
  const ids = definition.dimensions.map((dimension) => dimension.id);
  return ledger.entries
    .filter((entry) => entry.definitionVersion === definition.version && typeof entry.owner?.fun === "number")
    .filter((entry) => ids.every((id) => typeof entry.studio.dimensions[id] === "number"))
    .map((entry) => ({
      target: Math.log((entry.owner?.fun ?? 1) / 100),
      features: ids.map((id) => Math.log(Math.max(1, entry.studio.dimensions[id]) / 100)),
    }));
}

export function refitWeights(definition: FunDefinition, ledger: Ledger): { weights: number[]; samples: number } {
  const data = samples(definition, ledger);
  const count = definition.dimensions.length;
  const prior = Array(count).fill(1 / count);
  if (data.length < 2) {
    return { weights: definition.dimensions.map((dimension) => dimension.weight), samples: data.length };
  }
  let weights = [...prior];
  const ridge = definition.calibration.ridge;
  for (let step = 0; step < STEPS; step++) {
    const gradient = weights.map((weight, i) => 2 * ridge * (weight - prior[i]));
    for (const sample of data) {
      const predicted = sample.features.reduce((sum, feature, i) => sum + feature * weights[i], 0);
      const error = predicted - sample.target;
      sample.features.forEach((feature, i) => {
        gradient[i] += (2 * error * feature) / data.length;
      });
    }
    weights = projectToSimplex(weights.map((weight, i) => weight - STEP_SIZE * gradient[i]));
  }
  return { weights: weights.map((weight) => Math.round(weight * PRECISION) / PRECISION), samples: data.length };
}
