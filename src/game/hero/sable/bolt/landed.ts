import { W } from "../../../../constants/stage";
import type { Enemy } from "../../../../types/enemy";
import { dealDamage } from "../../../damage";
import { enemyCenter } from "../../../enemies/enemy";
import { addStacks, markFoe } from "../../../enemies/skillStatus";
import { skillEvolved, skillValues } from "../../../skills/query";
import { game, progress } from "../../../state";
import { looseBolt } from "../loose";
import { sable } from "../memory";
import { quiverSize } from "../quiver";
import { netHolding } from "../spells/net";
import { burst } from "./burst";
import { createFlyingFoe } from "./flyingFoe";
import { isFar } from "./power";
import type { Shot } from "./shot";

/** pixels from the stage edge where a pushed foe counts as slammed into it */
const EDGE = 26;
/** seconds between a lodged bolt's ticks */
const LODGE_TICK = 0.5;

/** standing foes near a point, nearest first, leaving out the ones given */
function foesNear(x: number, y: number, reach: number, skip: ReadonlySet<Enemy>): Enemy[] {
  return game.enemies
    .filter((e) => e.hp > 0 && !skip.has(e))
    .map((e) => ({ e, d: Math.hypot(enemyCenter(e)[0] - x, enemyCenter(e)[1] - y) }))
    .filter((o) => o.d <= reach)
    .sort((a, b) => a.d - b.d)
    .map((o) => o.e);
}

/** a bolt flies on from a foe it struck toward another */
function offshoot(from: Enemy, to: Enemy, b: Shot, change: Partial<Shot>): void {
  const [x, y] = enemyCenter(from);
  const [tx, ty] = enemyCenter(to);
  looseBolt({ ...b, x, y, angle: Math.atan2(ty - y, tx - x), closing: false, side: false, offshoot: true, ...change });
}

/** Ricochet: a bolt that hits bounces on to the nearest foe it has not struck; Splinter Storm splits each bounce */
function ricochet(e: Enemy, b: Shot): void {
  const v = skillValues("s_ricochet");
  const depth = b.depth ?? 0;
  if (!v.chain || depth >= v.chain) return;
  const [x, y] = enemyCenter(e);
  const next = foesNear(x, y, v.reach, b.struck ?? new Set());
  if (!next.length) return;
  const family = b.family ?? { splits: v.split ?? 0 };
  const count = family.splits > 0 && next.length > 1 ? 2 : 1;
  if (count > 1) family.splits--;
  for (const to of next.slice(0, count)) offshoot(e, to, b, { depth: depth + 1, share: v.share, family });
  if (v.stagger) e.stagger = Math.max(e.stagger, v.stagger);
}

/** Breaching Bolt: the closing bolt bursts, throws its foe into others, pins it to the edge; Siege Bolt pins every foe */
function breach(e: Enemy, dir: number): void {
  const v = skillValues("s_breach");
  const [cx, cy] = enemyCenter(e);
  if (v.burst) burst({ x: cx, y: cy, radius: v.radius, power: v.burst, skip: e });
  if (v.bodies) game.fx.push(createFlyingFoe(e, dir, v.bodies));
  const slammed = dir > 0 ? e.x > W - EDGE : e.x < EDGE;
  if (v.pin && (slammed || v.pierceAll)) {
    e.pinned = Math.max(e.pinned, v.pin);
    if (v.mark) markFoe(e, v.pin, v.mark);
    if (slammed) dealDamage(e, progress.stats.ad * v.pinPower, { fromX: e.x - dir * 10, heavy: true });
  }
}

/** Clockwork Cadence: a closing bolt primed by a perfect reload bursts */
function cadence(e: Enemy): void {
  const v = skillValues("s_rhythm");
  if (!v.burst) return;
  const [cx, cy] = enemyCenter(e);
  burst({ x: cx, y: cy, radius: v.radius, power: v.burst, skip: e });
}

/** Longshot: a far hit marks the foe, a far kill puts the bolt back, Horizon Shot splits far hits */
function longshot(e: Enemy, b: Shot, killed: boolean): void {
  const v = skillValues("s_longshot");
  if (v.mark) markFoe(e, v.markTime, v.mark);
  if (killed && v.refund) sable.ammo = Math.min(quiverSize(), sable.ammo + 1);
  if (!v.split || b.offshoot) return;
  const [x, y] = enemyCenter(e);
  for (const to of foesNear(x, y, 140, b.struck ?? new Set()).slice(0, v.split))
    offshoot(e, to, b, { share: 0.5, prime: null });
}

/** Featherdraw: an air bolt splits in two on a hit, slanting down past the foe */
function featherSplit(e: Enemy, b: Shot, dir: number): void {
  const [x, y] = enemyCenter(e);
  for (const a of [-0.45, 0.45])
    looseBolt({ ...b, x, y, angle: (dir > 0 ? 0 : Math.PI) + a, share: 0.5, closing: false, offshoot: true });
}

/** what the skills do when a bolt strikes a foe (it may still fly on) */
export function boltLanded(e: Enemy, b: Shot, at: { flown: number; killed: boolean; dir: number }): void {
  if (isFar(at.flown)) longshot(e, b, at.killed);
  if (b.closing) {
    breach(e, at.dir);
    if (b.prime === "reload") cadence(e);
  }
  if (b.hop) {
    const v = skillValues("s_hopVolley");
    if (v.slow) e.chill = Math.max(e.chill, v.slowTime);
  }
  if (b.air && !b.offshoot && skillValues("s_featherdraw").split) featherSplit(e, b, at.dir);
  netHolding(e)?.boltStruck();
  if (!at.killed || !skillValues("s_ricochet").killOn) ricochet(e, b);
}

/** Lodged Bolts: a bolt that stops in a foe stays there and festers (the closing bolt lodges more) */
export function boltStopped(e: Enemy, b: Shot): void {
  const v = skillValues("s_lodged");
  if (!v.rate) return;
  addStacks(e, "s_lodged", {
    stacks: b.closing ? v.closing : 1,
    max: v.max,
    damage: progress.stats.ad * v.rate * LODGE_TICK,
    every: LODGE_TICK,
    duration: skillEvolved("s_lodged") ? 12 : 8,
  });
}
