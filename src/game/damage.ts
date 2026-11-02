import { DAMAGE, ENEMY_AIR, FUSION, GUARD, JUGGLE_LIMIT } from "../constants/combat";
import { ENEMIES } from "../constants/enemies";
import { SPARKS } from "../constants/palette";
import { sfx } from "../services/audio";
import type { Enemy } from "../types/enemy";
import type { DamageTag } from "../types/game";
import { createImpact } from "./effects/impact";
import { launchEnemy } from "./enemies/airborne";
import { enemyBox, enemyCenter } from "./enemies/enemy";
import { killEnemy } from "./kill";
import { hasPerk } from "./progress";
import { explode } from "./spells/explosion";
import { game, progress, rng } from "./state";

export interface HitOptions {
  /** where the blow comes from, for back attacks and guards */
  fromX?: number;
  kx?: number;
  ky?: number;
  launch?: number;
  spike?: boolean;
  stun?: number;
  /** breaks a wind-up, and a guard when it is a sword blow */
  heavy?: boolean;
  /** a sword blow: guards stop it unless it is heavy */
  melee?: boolean;
  /** burning and other damage over time: no crits, no numbers in white */
  dot?: boolean;
}
/** what a blow did: landed, or stopped by a guard */
export type HitResult = "hit" | "blocked";

/** a foe struck from the side it is not facing */
export function isBehind(e: Enemy, fromX: number): boolean {
  const side = Math.sign(fromX - e.x);
  return side !== 0 && side !== e.face;
}

/** numbers that pop over the same foe at nearly the same time stack upward instead of overlapping */
const STACK = { near: 12, fresh: 0.25, step: 9 } as const;

function popNumber(e: Enemy, value: number, tag: DamageTag, big: boolean): void {
  const box = enemyBox(e);
  const x = (box[0] + box[2]) / 2 + rng.range(-4, 4);
  const crowd = game.numbers.filter((n) => Math.abs(n.x - x) < STACK.near && n.age < STACK.fresh).length;
  game.numbers.push({
    x,
    y: box[1] - 2 - crowd * STACK.step,
    age: 0,
    vy: big ? -60 : -45,
    value,
    tag,
    big,
    life: big ? 0.9 : 0.7,
  });
}

/** husks from wave 3 and brutes hold up a guard while they walk, facing the blow */
function guards(e: Enemy, o: HitOptions): boolean {
  if (!o.melee || o.fromX === undefined) return false;
  if (e.type !== "husk" && e.type !== "brute") return false;
  if (e.type === "husk" && game.wave < GUARD.fromWave) return false;
  return e.state === "walk" && !e.air && e.stun <= 0 && e.frozen <= 0 && e.shock <= 0 && !isBehind(e, o.fromX);
}

/** a blocked blow: a little chip damage, sparks, and on the second in a row a fast counter */
function block(e: Enemy, base: number): HitResult {
  const value = Math.max(1, Math.round(base * GUARD.chip));
  e.hp -= value;
  popNumber(e, value, "block", false);
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx + e.face * 6, cy - 4, -e.face, false, SPARKS.hot));
  sfx.block();
  e.guardHits++;
  if (e.guardHits >= GUARD.counterAfter)
    Object.assign(e, { state: "wind", st: GUARD.counterWind, guardHits: 0, cd: 0 });
  if (e.hp <= 0) killEnemy(e);
  return "blocked";
}

/** Shatter: the ice breaks into shards that cut every foe near the frozen one */
function shatter(e: Enemy): void {
  e.frozen = 0;
  const [cx, cy] = enemyCenter(e);
  for (const other of game.enemies) {
    if (other === e || other.hp <= 0) continue;
    const [ox, oy] = enemyCenter(other);
    if (Math.hypot(ox - cx, oy - cy) < FUSION.shatterReach)
      dealDamage(other, progress.stats.ad * FUSION.shatterShards, { fromX: cx, kx: Math.sign(ox - cx) * 80 });
  }
  game.fx.push(createImpact(cx, cy, 1, true, SPARKS.ice));
  sfx.shatter();
}

/** Apply a hit: back attacks deal 1.5x, airborne foes take 2x, crits 1.75x, all stacking. Guards stop light sword blows. */
export function dealDamage(e: Enemy, base: number, o: HitOptions = {}): HitResult {
  if (e.hp <= 0) return "hit";
  const def = ENEMIES[e.type];
  let tag: DamageTag = o.dot ? "burn" : "normal";
  if (guards(e, o)) {
    if (!o.heavy) return block(e, base);
    e.stun = Math.max(e.stun, def.launchable ? GUARD.breakStun : GUARD.breakStun * 0.6);
    e.guardHits = 0;
    tag = "break";
  }
  const back = o.fromX !== undefined && isBehind(e, o.fromX);
  const crit = !o.dot && rng.chance(progress.stats.crit);
  let dmg = base;
  if (back) {
    dmg *= DAMAGE.back;
    tag = "back";
  }
  if (e.air) {
    dmg *= DAMAGE.air;
    tag = "air";
  }
  if (crit) {
    dmg *= DAMAGE.crit;
    tag = "crit";
  }
  const shattering = hasPerk("shatter") && o.melee && o.heavy && e.frozen > 0;
  if (shattering) {
    dmg *= 2;
    tag = "shatter";
  }
  const value = Math.max(1, Math.round(dmg));
  e.hp -= value;
  e.flash = 0.1;
  e.guardHits = 0;
  popNumber(e, value, tag, crit || shattering || (back && e.air));
  if (shattering) shatter(e);
  e.vx += (o.kx ?? 0) * (1 - def.weight);
  if (o.spike && e.air) e.vy = ENEMY_AIR.spike;
  else if (o.launch && def.launchable) {
    const burning = e.burn > 0;
    launchEnemy(e, o.launch);
    if (burning && hasPerk("ignition")) {
      e.burn = 0;
      const [cx, cy] = enemyCenter(e);
      explode(cx, cy, FUSION.ignitionRadius, progress.stats.ap * FUSION.ignition, 2, 0);
    }
  } else if (e.air && !o.dot) {
    e.airHits++;
    const hold = Math.max(0, 1 - e.airHits / JUGGLE_LIMIT);
    if (hold > 0) e.vy = Math.min(e.vy, ENEMY_AIR.juggle * hold);
  } else if (e.type === "wisp") e.vy += o.ky ?? 0;
  if (o.stun && def.launchable) e.stun = Math.max(e.stun, o.stun);
  if (o.heavy && e.state === "wind" && def.rank === "minion") Object.assign(e, { state: "recover", st: 0 });
  if (e.hp <= 0) killEnemy(e);
  return "hit";
}
