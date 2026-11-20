import { HERO_START_X } from "../../constants/hero";
import { PLATFORMS, W } from "../../constants/stage";
import type { Enemy } from "../../types/enemy";
import type { Point } from "../../types/world";
import { clamp } from "../../utils/math";
import type { Rng } from "../../utils/rng";
import { EXIT_X, FOES_TOTAL, PAR_SECONDS, ROUTE, STAGE_PLATFORMS, STAGE_WALLS, STAGE_WIDTH } from "./route";

interface Trail {
  id: number;
  mentors: readonly Point[];
  area: number;
  nextFoe: number;
  bossesDefeated: number;
  foesDefeated: number;
  damage: number;
  farthest: number;
  camera: number;
  left: number;
  gate: number | null;
  boss: Enemy | null;
  authored: WeakSet<Enemy>;
  perched: WeakMap<Enemy, number>;
}

export let trail: Trail | null = null;
let lastRunId = 0;

export function resetAdventure(): void {
  trail = null;
}

export function beginAdventure(random: Rng): void {
  trail = {
    id: ++lastRunId,
    mentors: ROUTE.map((area) => random.pick(area.mentorSites)),
    area: 0,
    nextFoe: 0,
    bossesDefeated: 0,
    foesDefeated: 0,
    damage: 0,
    farthest: 0,
    camera: 0,
    left: 0,
    gate: null,
    boss: null,
    authored: new WeakSet(),
    perched: new WeakMap(),
  };
}

export const stageRunId = (): number | null => trail?.id ?? null;
export const isAdventure = (): boolean => trail !== null;
export const stageCameraX = (): number => trail?.camera ?? 0;
export const stagePlatforms = () => (trail ? STAGE_PLATFORMS : PLATFORMS);
export const stageWalls = () => (trail ? STAGE_WALLS : []);
export const stageExitX = (): number => EXIT_X;
export const stageThreat = (wave: number): number => (trail && ROUTE[trail.area] ? ROUTE[trail.area].threat : wave);
export const stageGate = (): number | null => trail?.gate ?? null;
export const stageLeft = (): number => trail?.left ?? 0;
export const stageRight = (): number => (trail ? (trail.gate ?? STAGE_WIDTH) : W);
export const stageBounds = () => ({ left: stageLeft(), right: stageRight() });
export const clampStageX = (x: number, margin: number): number => clamp(x, stageLeft() + margin, stageRight() - margin);
export const stageGates = (): readonly number[] => {
  if (!trail?.left) return [];
  return trail.gate === null ? [trail.left] : [trail.left, trail.gate];
};

export function stageProgress() {
  return {
    bossesDefeated: trail?.bossesDefeated ?? 0,
    bossesTotal: ROUTE.length,
    foesDefeated: trail?.foesDefeated ?? 0,
    foesTotal: FOES_TOTAL,
    damageCoverage: clamp((trail?.damage ?? 0) / FOES_TOTAL),
    distance: clamp(((trail?.farthest ?? HERO_START_X) - HERO_START_X) / (EXIT_X - HERO_START_X)),
    parSeconds: PAR_SECONDS,
  };
}

export function recordStageDamage(enemy: Enemy, amount: number): void {
  if (!trail?.authored.has(enemy)) return;
  trail.damage += Math.max(0, Math.min(enemy.hp, amount)) / enemy.max;
}

export function recordStageKill(enemy: Enemy): void {
  if (!trail?.authored.delete(enemy)) return;
  trail.foesDefeated++;
}
