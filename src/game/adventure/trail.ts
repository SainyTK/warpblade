import { PLATFORMS, W } from "../../constants/stage";
import { STAGES } from "../../stages";
import { runRates } from "../../store/meta";
import type { StageId } from "../../types/campaign";
import type { Enemy, EnemyType } from "../../types/enemy";
import type { Platform, Point } from "../../types/world";
import { clamp } from "../../utils/math";
import type { Rng } from "../../utils/rng";
import { type StageMods, stageMods } from "../../utils/stageArc";
import { buildRoute, type Route, type SurgeBeat } from "./route";

export interface SurgeWave {
  foes: EnemyType[];
  levels: number[];
  xp: number[];
  elites: boolean[];
}

export interface Surge {
  beat: SurgeBeat;
  waves: SurgeWave[];
  wave: number;
  sent: number;
  delays: number[];
  pause: number;
}

interface Leash {
  left: number;
  right: number;
}

interface Trail {
  id: number;
  random: Rng;
  route: Route;
  hyper: boolean;
  mods: StageMods;
  finale: boolean;
  finaleFoe: Enemy | null;
  mentors: readonly Point[];
  area: number;
  pack: number;
  packFoes: Enemy[];
  hold: number | null;
  beat: number;
  lull: number;
  band: number;
  bigFoe: Enemy | null;
  bigFoesDefeated: number;
  miniDefeated: boolean;
  foesDefeated: number;
  damage: number;
  farthest: number;
  camera: number;
  leash: Leash | null;
  left: number;
  gate: number | null;
  surge: Surge | null;
  authored: WeakSet<Enemy>;
  perched: WeakMap<Enemy, number>;
}

export let trail: Trail | null = null;
let lastRunId = 0;

export function resetAdventure(): void {
  trail = null;
}

export function beginAdventure(random: Rng, stage: StageId, hyper: boolean): void {
  const mods = stageMods(STAGES[stage], hyper, runRates());
  const route = buildRoute(STAGES[stage], mods, random);
  trail = {
    id: ++lastRunId,
    random,
    route,
    hyper,
    mods,
    finale: false,
    finaleFoe: null,
    mentors: route.areas.map((area) => random.pick(area.mentorSites)),
    area: 0,
    pack: 0,
    packFoes: [],
    hold: null,
    beat: 0,
    lull: 0,
    band: route.areas[0].enter,
    bigFoe: null,
    bigFoesDefeated: 0,
    miniDefeated: false,
    foesDefeated: 0,
    damage: 0,
    farthest: 0,
    camera: 0,
    leash: null,
    left: 0,
    gate: null,
    surge: null,
    authored: new WeakSet(),
    perched: new WeakMap(),
  };
}

export const stageRunId = (): number | null => trail?.id ?? null;
export const isAdventure = (): boolean => trail !== null;
export const currentStage = () => trail?.route.stage ?? null;
export const stageBoss = (): Enemy | null => trail?.bigFoe ?? null;
export const stageBand = (): number => trail?.band ?? 1;

export function stageWhere(): string {
  if (!trail) return "";
  const areas = trail.route.areas.length;
  return `${trail.route.stage.name}, area ${Math.min(trail.area + 1, areas)} of ${areas}`;
}

export function stageStatus(): string {
  if (!trail) return "";
  const areas = trail.route.areas.length;
  const area = trail.route.areas[trail.area];
  const surges = area?.beats.filter((beat) => beat.kind === "surge").length ?? 0;
  const wave = trail.surge ? `  WAVE ${trail.surge.wave + 1}/${trail.surge.waves.length}` : "";
  const surge =
    trail.gate !== null && trail.surge ? `  SURGE ${Math.min(trail.beat + 1, surges)}/${surges}${wave}` : "";
  return `${trail.route.stage.name} ${Math.min(trail.area + 1, areas)}/${areas}${surge}`;
}
export const stageCameraX = (): number => trail?.camera ?? 0;
export function stageAreaShare(): number {
  const areas = trail?.route.areas.length ?? 1;
  return areas > 1 ? clamp((trail?.area ?? 0) / (areas - 1)) : 1;
}
export const stagePlatforms = (): readonly Platform[] => (trail ? trail.route.platforms : PLATFORMS);
export const stageWalls = (): readonly Platform[] => (trail ? trail.route.walls : []);
export const stageExitX = (): number => trail?.route.exitX ?? W;
export const stageGate = (): number | null => trail?.gate ?? null;
export const stageLeft = (): number => trail?.left ?? 0;
export const stageRight = (): number => (trail ? (trail.gate ?? trail.hold ?? trail.route.width) : W);
export const stageBounds = () => ({ left: stageLeft(), right: stageRight() });
export const heroLeash = (): Leash | null => trail?.leash ?? null;
export const clampStageX = (x: number, margin: number): number => clamp(x, stageLeft() + margin, stageRight() - margin);
export const stageGates = (): readonly number[] => {
  if (!trail) return [];
  const sides = [trail.left || null, trail.gate ?? trail.hold];
  return sides.filter((x): x is number => x !== null);
};

function stageShare(): number {
  if (!trail) return 0;
  const areas = trail.route.areas;
  const area = areas[trail.area];
  if (!area) return 1;
  const walked = clamp((trail.farthest - area.start) / Math.max(1, area.entrance - area.start));
  const room = trail.gate === null ? 0 : trail.beat / area.beats.length;
  const within = trail.gate === null ? walked * 0.3 : 0.3 + room * 0.7;
  return clamp((trail.area + within) / areas.length);
}

export function stageProgress() {
  const route = trail?.route;
  return {
    stage: route?.stage.id ?? "prologue",
    hyper: trail?.hyper ?? false,
    bigFoesDefeated: trail?.bigFoesDefeated ?? 0,
    miniDefeated: trail?.miniDefeated ?? false,
    foesDefeated: trail?.foesDefeated ?? 0,
    foesTotal: route?.foesTotal ?? 1,
    damageCoverage: clamp((trail?.damage ?? 0) / (route?.foesTotal ?? 1)),
    distance: stageShare(),
    parSeconds: route?.parSeconds ?? 0,
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

export const stageWon = (): boolean => trail?.finale ?? false;
export const finaleHolds = (e: Enemy): boolean => trail?.finaleFoe === e;

const NO_MODS: Pick<StageMods, "pace" | "coins" | "heartChance"> = { pace: 1, coins: 1, heartChance: 1 };
export const stageFoePace = (): number => (trail?.mods ?? NO_MODS).pace;
export const stageCoinRate = (): number => (trail?.mods ?? NO_MODS).coins;
export const stageHeartRate = (): number => (trail?.mods ?? NO_MODS).heartChance;
