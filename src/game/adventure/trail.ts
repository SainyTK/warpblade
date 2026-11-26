import { HERO_START_X } from "../../constants/hero";
import { PLATFORMS, W } from "../../constants/stage";
import { RIFT_STAGES, STAGES } from "../../stages";
import type { ArtId, StageId } from "../../types/campaign";
import type { Enemy, EnemyType } from "../../types/enemy";
import type { Platform, Point } from "../../types/world";
import { stageBaseThreat, stageHpScale } from "../../utils/campaign";
import { clamp } from "../../utils/math";
import type { Rng } from "../../utils/rng";
import { buildRoute, type Route } from "./route";

export interface Surge {
  foes: EnemyType[];
  sent: number;
  cap: number;
  refills: number[];
}

interface Trail {
  id: number;
  random: Rng;
  route: Route;
  cleared: StageId[];
  mentors: readonly Point[];
  area: number;
  nextFoe: number;
  bossesDefeated: number;
  foesDefeated: number;
  foesTotal: number;
  parTotal: number;
  damage: number;
  farthest: number;
  camera: number;
  left: number;
  gate: number | null;
  boss: Enemy | null;
  surge: Surge | null;
  safeX: number;
  authored: WeakSet<Enemy>;
  perched: WeakMap<Enemy, number>;
}

export let trail: Trail | null = null;
let lastRunId = 0;

export function resetAdventure(): void {
  trail = null;
}

function riftsCleared(cleared: readonly StageId[]): number {
  return cleared.filter((id) => STAGES[id].kind === "rift").length;
}

export function routeFor(id: StageId, cleared: readonly StageId[]): Route {
  const stage = STAGES[id];
  const rifts = riftsCleared(cleared);
  return buildRoute(stage, stageBaseThreat(stage, rifts), stageHpScale(stage, rifts));
}

export function beginAdventure(random: Rng, first: StageId = "prologue", cleared: readonly StageId[] = []): void {
  const route = routeFor(first, cleared);
  trail = {
    id: ++lastRunId,
    random,
    route,
    cleared: [...cleared],
    mentors: route.areas.map((area) => random.pick(area.mentorSites)),
    area: 0,
    nextFoe: 0,
    bossesDefeated: 0,
    foesDefeated: 0,
    foesTotal: route.foesTotal,
    parTotal: route.parSeconds,
    damage: 0,
    farthest: 0,
    camera: 0,
    left: 0,
    gate: null,
    boss: null,
    surge: null,
    safeX: HERO_START_X,
    authored: new WeakSet(),
    perched: new WeakMap(),
  };
}

export function loadStage(id: StageId): void {
  if (!trail) return;
  const route = routeFor(id, trail.cleared);
  Object.assign(trail, {
    route,
    mentors: route.areas.map((area) => trail?.random.pick(area.mentorSites)),
    area: 0,
    nextFoe: 0,
    foesTotal: trail.foesTotal + route.foesTotal,
    parTotal: trail.parTotal + route.parSeconds,
    farthest: 0,
    camera: 0,
    left: 0,
    gate: null,
    boss: null,
    surge: null,
    safeX: HERO_START_X,
  });
}

export const stageRunId = (): number | null => trail?.id ?? null;
export const isAdventure = (): boolean => trail !== null;
export const currentStage = () => trail?.route.stage ?? null;
export const clearedStages = (): readonly StageId[] => trail?.cleared ?? [];
export const earnedArtsOrder = (): ArtId[] =>
  (trail?.cleared ?? []).flatMap((id) => {
    const art = STAGES[id].grantsArt;
    return art ? [art] : [];
  });
export function stageWhere(): string {
  if (!trail) return "";
  const areas = trail.route.areas.length;
  return `${trail.route.stage.name}, area ${Math.min(trail.area + 1, areas)} of ${areas}`;
}

export function stageStatus(): string {
  if (!trail) return "";
  const areas = trail.route.areas.length;
  return `${trail.route.stage.name} ${Math.min(trail.area + 1, areas)}/${areas}`;
}
export const stageCameraX = (): number => trail?.camera ?? 0;
export function stageAreaShare(): number {
  const areas = trail?.route.areas.length ?? 1;
  return areas > 1 ? clamp((trail?.area ?? 0) / (areas - 1)) : 1;
}
export const stagePlatforms = (): readonly Platform[] => (trail ? trail.route.platforms : PLATFORMS);
export const stageWalls = (): readonly Platform[] => (trail ? trail.route.walls : []);
export const stagePits = (): readonly Platform[] => trail?.route.pits ?? [];
export const stageExitX = (): number => trail?.route.exitX ?? W;
export const stageThreat = (wave: number): number => {
  const area = trail?.route.areas[trail.area];
  return area ? area.threat : wave;
};
export const stageGate = (): number | null => trail?.gate ?? null;
export const stageLeft = (): number => trail?.left ?? 0;
export const stageRight = (): number => (trail ? (trail.gate ?? trail.route.width) : W);
export const stageBounds = () => ({ left: stageLeft(), right: stageRight() });
export const clampStageX = (x: number, margin: number): number => clamp(x, stageLeft() + margin, stageRight() - margin);
export const stageGates = (): readonly number[] => {
  if (!trail?.left) return [];
  return trail.gate === null ? [trail.left] : [trail.left, trail.gate];
};

export function overPit(x: number): boolean {
  for (const gap of stagePits()) {
    if (x > gap.x0 && x < gap.x1) return true;
  }
  return false;
}

const stageCount = (): number => RIFT_STAGES.length + 2;

export function stageProgress() {
  const route = trail?.route;
  const through = route ? clamp(((trail?.farthest ?? HERO_START_X) - HERO_START_X) / (route.exitX - HERO_START_X)) : 0;
  const done = trail?.cleared.length ?? 0;
  return {
    bossesDefeated: trail?.bossesDefeated ?? 0,
    bossesTotal: stageCount(),
    foesDefeated: trail?.foesDefeated ?? 0,
    foesTotal: trail?.foesTotal ?? 1,
    damageCoverage: clamp((trail?.damage ?? 0) / (trail?.foesTotal ?? 1)),
    distance: clamp((done + through) / stageCount()),
    parSeconds: trail?.parTotal ?? 0,
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

export function facingFinale(finale: string): boolean {
  const area = trail?.route.areas[trail.area];
  return trail?.gate !== null && area?.room.kind === "boss" && area.room.foe === finale;
}
