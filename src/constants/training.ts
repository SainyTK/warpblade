import type { EnemyType } from "../types/enemy";
import type { Point } from "../types/world";
import { GROUND, W } from "./stage";

interface TrainingTarget extends Point {
  type: EnemyType;
}

export const TRAINING_TARGETS: readonly TrainingTarget[] = [
  { type: "husk", x: W * 0.62, y: GROUND },
  { type: "wisp", x: W * 0.8, y: GROUND - 35 },
];

export const TRAINING_WAVE = 1;

export const TARGET_RESPAWN = 0.9;
