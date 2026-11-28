import { median } from "../../utils/median";
import type { MeasureReading } from "../types";
import { bandScore, rubricScore } from "./bandScore";
import type { DimensionDefinition, FunDefinition, FunScore, PartScore } from "./types";

const round = (value: number) => Math.round(value * 10) / 10;

function dimensionParts(
  dimension: DimensionDefinition,
  readings: Map<string, MeasureReading>,
  rubric: Record<string, number[]>,
): { parts: Record<string, PartScore>; missing: string[] } {
  const parts: Record<string, PartScore> = {};
  const missing: string[] = [];
  for (const measure of dimension.measures) {
    const raw = readings.get(measure.id)?.raw ?? null;
    if (raw === null) {
      missing.push(measure.id);
      continue;
    }
    parts[measure.id] = { raw, score: round(bandScore(measure.band, raw)) };
  }
  const level = median(rubric[dimension.rubric.id] ?? []);
  if (level === null) {
    missing.push(dimension.rubric.id);
  } else {
    parts[dimension.rubric.id] = { raw: level, score: round(rubricScore(level)) };
  }
  return { parts, missing };
}

export function scoreFun(
  definition: FunDefinition,
  readings: readonly MeasureReading[],
  rubric: Record<string, number[]>,
): FunScore {
  const byId = new Map(readings.map((reading) => [reading.id, reading]));
  const dimensions: Record<string, number> = {};
  const parts: Record<string, PartScore> = {};
  const missing: string[] = [];
  let weightTaken = 0;
  let logSum = 0;
  for (const dimension of definition.dimensions) {
    const scored = dimensionParts(dimension, byId, rubric);
    Object.assign(parts, scored.parts);
    missing.push(...scored.missing);
    const scores = Object.values(scored.parts).map((part) => part.score);
    if (scores.length === 0) {
      continue;
    }
    const value = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    dimensions[dimension.id] = round(value);
    weightTaken += dimension.weight;
    logSum += dimension.weight * Math.log(value / 100);
  }
  const fun = weightTaken > 0 ? 100 * Math.exp(logSum / weightTaken) : 0;
  return { definitionVersion: definition.version, fun: round(fun), dimensions, parts, missing };
}
