import type { BigFoeCall } from "../../constants/defense";
import { CRYSTAL, DEFENSE_SECONDS } from "../../constants/defense";
import { STAGE_TIER } from "../../constants/stageGraph";
import { STAGES } from "../../stages";
import { runRates } from "../../store/meta";
import type { StageDef, StageId } from "../../types/campaign";
import type { CrystalWatch, DefenseSide } from "../../types/defense";
import type { Enemy } from "../../types/enemy";
import { secondsLeft } from "../../utils/defenseClock";
import type { Rng } from "../../utils/rng";
import { type StageMods, stageMods } from "../../utils/stageArc";
import { buildField, type Field } from "./field";

export interface Crystal {
  x: number;
  hp: number;
  max: number;
  flash: number;
  lastHitAt: number;
  struckBy: WeakMap<Enemy, number>;
}

export interface Fronts {
  index: number;
  open: DefenseSide[];
  next: DefenseSide[] | null;
  turnAt: number;
  surging: DefenseSide | null;
  surgeAt: number;
}

interface Leash {
  left: number;
  right: number;
}

export type DefenseEnd = "held" | "shattered";

export interface BigFoeOnField {
  foe: Enemy;
  kind: BigFoeCall["kind"];
}

export interface Defense {
  id: number;
  random: Rng;
  stage: StageDef;
  hyper: boolean;
  mods: StageMods;
  field: Field;
  elapsed: number;
  end: DefenseEnd | null;
  endIn: number;
  crystal: Crystal;
  fronts: Fronts;
  packIn: number;
  xpPaidTo: number;
  sideFoes: Record<DefenseSide, number>;
  bigFoeCall: number;
  bigFoeArriving: boolean;
  bigFoes: BigFoeOnField[];
  bigFoesDefeated: number;
  miniDefeated: boolean;
  band: number;
  foesSpawned: number;
  foesDefeated: number;
  damage: number;
  camera: number;
  leash: Leash | null;
  pickIn: number | null;
  authored: WeakSet<Enemy>;
}

export let defense: Defense | null = null;
let lastRunId = 0;

export function resetAdventure(): void {
  defense = null;
}

function freshCrystal(stage: StageDef, x: number): Crystal {
  const max = Math.round(CRYSTAL.hp * (1 + CRYSTAL.hpPerTier * (STAGE_TIER[stage.id] - 1)));
  return { x, hp: max, max, flash: 0, lastHitAt: Number.NEGATIVE_INFINITY, struckBy: new WeakMap() };
}

export function beginAdventure(random: Rng, stageId: StageId, hyper: boolean): void {
  const stage = STAGES[stageId];
  const field = buildField(stage.areas[0]);
  defense = {
    id: ++lastRunId,
    random,
    stage,
    hyper,
    mods: stageMods(stage, hyper, runRates()),
    field,
    elapsed: 0,
    end: null,
    endIn: 0,
    crystal: freshCrystal(stage, field.center),
    fronts: { index: -1, open: [], next: null, turnAt: 0, surging: null, surgeAt: 0 },
    packIn: 0,
    xpPaidTo: 0,
    sideFoes: { west: 0, east: 0, sky: 0, below: 0 },
    bigFoeCall: 0,
    bigFoeArriving: false,
    bigFoes: [],
    bigFoesDefeated: 0,
    miniDefeated: false,
    band: 1,
    foesSpawned: 0,
    foesDefeated: 0,
    damage: 0,
    camera: 0,
    leash: null,
    pickIn: null,
    authored: new WeakSet(),
  };
}

export const stageRunId = (): number | null => defense?.id ?? null;
export const isAdventure = (): boolean => defense !== null;
export const currentStage = (): StageDef | null => defense?.stage ?? null;
export const stageBoss = (): Enemy | null => defense?.bigFoes.at(-1)?.foe ?? null;
export const stageBand = (): number => defense?.band ?? 1;
export const stageCameraX = (): number => defense?.camera ?? 0;
export const stageSecondsLeft = (): number => secondsLeft(defense?.elapsed ?? 0);
export const stageWon = (): boolean => defense?.end === "held";
export const crystalShattered = (): boolean => defense?.end === "shattered";
export const heroLeash = (): Leash | null => defense?.leash ?? null;

export function stageWhere(): string {
  if (!defense) return "";
  const minute = Math.min(DEFENSE_SECONDS / 60, Math.floor(defense.elapsed / 60) + 1);
  return `${defense.stage.name}, minute ${minute}`;
}

export const stageStatus = (): string => defense?.stage.name ?? "";

export interface CrystalView {
  x: number;
  share: number;
  low: boolean;
  flash: number;
  shattered: boolean;
  struckAt: number;
}

export function crystalView(): CrystalView | null {
  if (!defense) return null;
  const { x, hp, max, flash, lastHitAt } = defense.crystal;
  const share = Math.max(0, hp) / max;
  return {
    x,
    share,
    low: share <= CRYSTAL.lowShare,
    flash: flash / CRYSTAL.flashSeconds,
    shattered: defense.end === "shattered",
    struckAt: lastHitAt,
  };
}

const STRUCK_SECONDS = 0.3;

export function crystalWatch(now: number): CrystalWatch | null {
  const view = crystalView();
  if (!view) return null;
  return {
    share: view.share,
    low: view.low,
    struck: now - view.struckAt < STRUCK_SECONDS,
    secondsLeft: stageSecondsLeft(),
  };
}

export const stageAreaShare = (): number => (defense ? Math.min(1, defense.elapsed / DEFENSE_SECONDS) : 0);

export function stageProgress() {
  return {
    stage: defense?.stage.id ?? "prologue",
    hyper: defense?.hyper ?? false,
    bigFoesDefeated: defense?.bigFoesDefeated ?? 0,
    miniDefeated: defense?.miniDefeated ?? false,
    foesDefeated: defense?.foesDefeated ?? 0,
    foesTotal: Math.max(1, defense?.foesSpawned ?? 1),
    damageCoverage: Math.min(1, (defense?.damage ?? 0) / Math.max(1, defense?.foesSpawned ?? 1)),
    distance: stageAreaShare(),
    parSeconds: DEFENSE_SECONDS,
  };
}

export function recordStageDamage(enemy: Enemy, amount: number): void {
  if (!defense?.authored.has(enemy)) return;
  defense.damage += Math.max(0, Math.min(enemy.hp, amount)) / enemy.max;
}

export function recordStageKill(enemy: Enemy): void {
  if (!defense?.authored.delete(enemy)) return;
  defense.foesDefeated++;
}

const NO_MODS: Pick<StageMods, "pace" | "coins" | "heartChance"> = { pace: 1, coins: 1, heartChance: 1 };
export const stageFoePace = (): number => (defense?.mods ?? NO_MODS).pace;
export const stageCoinRate = (): number => (defense?.mods ?? NO_MODS).coins;
export const stageHeartRate = (): number => (defense?.mods ?? NO_MODS).heartChance;
