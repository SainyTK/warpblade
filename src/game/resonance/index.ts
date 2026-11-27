import { ELEMENTS } from "../../constants/elements";
import { BIG_FOE_BURST_CAP, BLAZE, FROST, PROC_DEPTH, STORM, VENOM, VOID } from "../../constants/resonance";
import { sfx } from "../../services/audio";
import type { SourceId } from "../../types/build";
import type { ElementId } from "../../types/campaign";
import type { Enemy } from "../../types/enemy";
import { hex } from "../../utils/color";
import { clamp } from "../../utils/math";
import { dealDamage } from "../damage";
import { createImpact } from "../effects/impact";
import { enemyCenter } from "../enemies/enemy";
import { addStacks, stacksOf } from "../enemies/skillStatus";
import { game, progress, rng } from "../state";
import { pushArc, pushEcho } from "./effects";

const COLOR: Record<ElementId, number> = {
  blaze: hex(ELEMENTS.blaze.color),
  frost: hex(ELEMENTS.frost.color),
  storm: hex(ELEMENTS.storm.color),
  venom: hex(ELEMENTS.venom.color),
  void: hex(ELEMENTS.void.color),
};
const WHITE_CORE = 0xfff8e8;

interface PendingEcho {
  foe: Enemy;
  damage: number;
  wait: number;
  depth: number;
}

const frostHits = new WeakMap<Enemy, number>();
let echoes: PendingEcho[] = [];

const fused = (id: (typeof progress.fusions)[number]): boolean => progress.fusions.includes(id);
const rank = (id: ElementId): number => progress.resonance[id];

export function resetResonance(): void {
  echoes = [];
}

const chilled = (e: Enemy): boolean => e.frozen > 0 || e.chill > 0;
const burning = (e: Enemy): boolean => stacksOf(e, "blaze") > 0 || e.burn > 0;

export function resonanceTaken(e: Enemy): number {
  let scale = 1;
  const venom = stacksOf(e, "venom");
  if (venom > 0) scale *= 1 + venom * VENOM.takenPerStack * (fused("blackIce") && chilled(e) ? 2 : 1);
  if (e.frozen > 0 && rank("frost") > 0) scale *= 1 + FROST.frozenTaken + FROST.frozenTakenPerRank * rank("frost");
  if (fused("thermalShock") && e.frozen > 0 && burning(e)) scale *= 2;
  return scale;
}

function blazeStacks(e: Enemy, damage: number, times = 1): void {
  const r = rank("blaze");
  if (r <= 0) return;
  const tick = damage * (BLAZE.tickShare + BLAZE.tickSharePerRank * r);
  const venom = fused("causticFire") ? 1 + stacksOf(e, "venom") * 0.08 : 1;
  addStacks(e, "blaze", {
    stacks: times,
    max: Math.round(BLAZE.baseStacks + BLAZE.stacksPerRank * r),
    damage: Math.max(1, tick * venom),
    every: BLAZE.every,
    duration: BLAZE.duration,
  });
}

function frostHit(e: Enemy): void {
  const r = rank("frost");
  if (r <= 0) return;
  e.chill = Math.max(e.chill, FROST.chill);
  const need = Math.max(FROST.fewestHitsToFreeze, Math.round(FROST.baseHitsToFreeze - FROST.hitsPerRank * r));
  const hits = (frostHits.get(e) ?? 0) + 1;
  if (hits < need) {
    frostHits.set(e, hits);
    return;
  }
  frostHits.set(e, 0);
  if (e.rank !== "minion") return;
  e.frozen = Math.max(e.frozen, FROST.freeze);
  sfx.resonance("frost");
}

function venomHit(e: Enemy, damage: number, times = 1): void {
  const r = rank("venom");
  if (r <= 0) return;
  addStacks(e, "venom", {
    stacks: times,
    max: Math.round(VENOM.baseStacks + VENOM.stacksPerRank * r),
    damage: Math.max(1, damage * VENOM.tickShare),
    every: VENOM.every,
    duration: VENOM.duration,
  });
}

function nearbyFoes(from: Enemy, reach: number, count: number): Enemy[] {
  const [cx, cy] = enemyCenter(from);
  return game.enemies
    .filter((other) => other !== from && other.hp > 0)
    .map((other) => {
      const [ox, oy] = enemyCenter(other);
      return { other, d: Math.hypot(ox - cx, oy - cy) };
    })
    .filter(({ d }) => d <= reach)
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map(({ other }) => other);
}

function arcColor(target: Enemy): number {
  if (fused("superconductor") && chilled(target)) return COLOR.frost;
  if (fused("plasma")) return COLOR.blaze;
  if (fused("neurotoxin")) return COLOR.venom;
  return COLOR.storm;
}

function stormArcs(e: Enemy, damage: number, depth: number, forced: boolean): void {
  const r = rank("storm");
  if (r <= 0) return;
  if (!forced && !rng.chance(clamp(STORM.chance + STORM.chancePerRank * r))) return;
  const extra = fused("plasma") && burning(e) ? 1 : 0;
  const targets = nearbyFoes(e, STORM.reach, 1 + Math.floor(r / STORM.ranksPerTarget) + extra);
  const [cx, cy] = enemyCenter(e);
  if (targets.length) sfx.resonance("storm");
  for (const target of targets) {
    const [tx, ty] = enemyCenter(target);
    pushArc(cx, cy, tx, ty, arcColor(target), WHITE_CORE);
    const boost = fused("superconductor") && chilled(target) ? 2 : 1;
    const share = (STORM.share + STORM.sharePerRank * r) * boost;
    dealDamage(target, damage * share, {
      source: "storm",
      fromX: cx,
      proc: depth + 1,
      sureCrit: r >= STORM.overchargeRank,
    });
    if (fused("plasma")) blazeStacks(target, damage, 2);
    if (fused("neurotoxin")) venomHit(target, damage, 3);
  }
}

function voidEcho(e: Enemy, damage: number, depth: number): void {
  const r = rank("void");
  if (r <= 0) return;
  const entropy = fused("entropy") ? stacksOf(e, "venom") * 0.01 : 0;
  const chance = Math.min(VOID.mostChance, VOID.chance + VOID.chancePerRank * r + entropy);
  if (!rng.chance(chance)) return;
  const stasis = fused("stasis") ? 1.2 : 1;
  const times = r >= VOID.riftRank ? 2 : 1;
  for (let i = 0; i < times; i++) {
    echoes.push({
      foe: e,
      damage: damage * (VOID.share + VOID.sharePerRank * r) * stasis,
      wait: VOID.delay * (i + 1),
      depth: depth + 1,
    });
  }
}

export interface ProcHit {
  foe: Enemy;
  damage: number;
  source: SourceId;
  depth: number;
}

export function resonate({ foe, damage, depth }: ProcHit): void {
  if (depth >= PROC_DEPTH) return;
  blazeStacks(foe, damage);
  frostHit(foe);
  venomHit(foe, damage);
  stormArcs(foe, damage, depth, false);
  voidEcho(foe, damage, depth);
}

function landEcho(echo: PendingEcho): void {
  const { foe, damage, depth } = echo;
  if (foe.hp <= 0) return;
  const [x, y] = enemyCenter(foe);
  pushEcho(x, y, COLOR.void);
  sfx.resonance("void");
  if (fused("hellfire")) blazeStacks(foe, damage, 3);
  if (fused("stasis") && foe.rank === "minion") foe.frozen = Math.max(foe.frozen, FROST.freeze * 0.5);
  dealDamage(foe, damage, { source: "void", fromX: x, proc: depth });
  if (fused("thunderEcho")) stormArcs(foe, damage, depth, true);
}

export function updateResonance(dt: number): void {
  if (!echoes.length) return;
  const due: PendingEcho[] = [];
  for (const echo of echoes) {
    echo.wait -= dt;
    if (echo.wait <= 0) due.push(echo);
  }
  echoes = echoes.filter((echo) => echo.wait > 0);
  for (const echo of due) landEcho(echo);
}

function burst(e: Enemy, share: number, radius: number, element: ElementId): void {
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx, cy, 1, true, [COLOR[element], COLOR[element], WHITE_CORE]));
  sfx.resonance(element);
  for (const other of nearbyFoes(e, radius, 12)) {
    const pool = other.rank === "minion" ? e.max : Math.min(e.max, other.max * BIG_FOE_BURST_CAP);
    dealDamage(other, pool * share, { source: element, fromX: cx, proc: PROC_DEPTH });
    if (element === "venom") venomHit(other, pool * 0.05, Math.ceil(stacksOf(e, "venom") * VENOM.plagueShare));
    if (element === "blaze") blazeStacks(other, pool * 0.05, 2);
  }
}

export function resonateDeath(e: Enemy): void {
  if (rank("blaze") >= BLAZE.wildfireRank && burning(e)) burst(e, BLAZE.wildfireShare, BLAZE.wildfireRadius, "blaze");
  if (rank("frost") >= FROST.shatterRank && chilled(e)) burst(e, FROST.shatterShare, FROST.shatterRadius, "frost");
  if (rank("venom") >= VENOM.plagueRank && stacksOf(e, "venom") > 0) burst(e, 0.05, VENOM.plagueRadius, "venom");
}
