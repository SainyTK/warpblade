import { DAMAGE, ENEMY_AIR, GUARD, IGNITION_RADIUS, JUGGLE_LIMIT, SHATTER_REACH } from "../constants/combat";
import { HERO_SOURCES } from "../constants/damageSources";
import { ENEMIES } from "../constants/enemies";
import { FLOW } from "../constants/growth";
import { SPARKS } from "../constants/palette";
import { sfx } from "../services/audio";
import type { SourceId } from "../types/build";
import type { Enemy } from "../types/enemy";
import type { DamageTag } from "../types/game";
import { buildStats } from "../utils/build";
import { isHeroSource } from "../utils/sources";
import { addFlow, flowDamage } from "./build/flow";
import { hitBonus, takenBonus } from "./damageHooks";
import { recordDamage } from "./damageLedger";
import { createImpact } from "./effects/impact";
import { launchEnemy } from "./enemies/airborne";
import { enemyCenter } from "./enemies/enemy";
import { kindOf } from "./enemies/kinds";
import { markBonus } from "./enemies/skillStatus";
import { kit } from "./hero/kits";
import { killEnemy } from "./kill";
import { popNumber } from "./numbers";
import { emitSkillEvent } from "./skills/events";
import { skillValues } from "./skills/query";
import { explode } from "./spells/explosion";
import { game, hero, progress, rng } from "./state";

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
  /** a husk stops walking for this long */
  stagger?: number;
  /** a Keen blow: always a critical hit */
  sureCrit?: boolean;
  /** burning and other damage over time: no crits, no numbers in white */
  dot?: boolean;
  /** what dealt the hit, for the end of run screen: the hero's own blows when not given, a skill's id for a hit the
   *  skill deals on its own (it builds no Flow) */
  source?: SourceId;
}
/** what a blow did: landed, or stopped by a guard */
export type HitResult = "hit" | "blocked";

/** Might and Flow multiply every hit, whatever its source */
const buildDamage = (): number => buildStats(progress.build).might * flowDamage();

/** a foe struck from the side it is not facing */
export function isBehind(e: Enemy, fromX: number): boolean {
  const side = Math.sign(fromX - e.x);
  return side !== 0 && side !== e.face;
}

/** guarding kinds (husks from wave 3, brutes) hold up a guard while they walk, facing the blow */
function guards(e: Enemy, o: HitOptions): boolean {
  if (!o.melee || o.fromX === undefined) return false;
  const kind = kindOf(e.type);
  if (kind.guardFrom === undefined || game.wave < kind.guardFrom) return false;
  return e.state === kind.rest && !e.air && e.stun <= 0 && e.frozen <= 0 && e.shock <= 0 && !isBehind(e, o.fromX);
}

/** a blocked blow: a little chip damage, sparks, and on the second in a row a fast counter */
function block(e: Enemy, base: number, source: SourceId): HitResult {
  const value = Math.max(1, Math.round(base * GUARD.chip));
  e.hp -= value;
  recordDamage(source, value);
  popNumber(e, value, "block", false, !HERO_SOURCES.has(source));
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx + e.face * 6, cy - 4, -e.face, false, SPARKS.hot));
  sfx.block();
  e.guardHits++;
  if (e.guardHits >= GUARD.counterAfter)
    Object.assign(e, { state: "wind", st: GUARD.counterWind, guardHits: 0, cd: 0 });
  if (e.hp <= 0) killEnemy(e);
  return "blocked";
}

/** Ice Spikes' shatter: the ice breaks into shards that cut every foe near the frozen one, `power` times attack damage;
 *  the shards count for the blow that broke it */
function shatter(e: Enemy, power: number, source: SourceId): void {
  e.frozen = 0;
  const [cx, cy] = enemyCenter(e);
  for (const other of game.enemies) {
    if (other === e || other.hp <= 0) continue;
    const [ox, oy] = enemyCenter(other);
    if (Math.hypot(ox - cx, oy - cy) < SHATTER_REACH)
      dealDamage(other, progress.stats.ad * power, { fromX: cx, kx: Math.sign(ox - cx) * 80, source });
  }
  game.fx.push(createImpact(cx, cy, 1, true, SPARKS.ice));
  sfx.shatter();
}

/** Fire Flask's ignition: a burning foe thrown into the air explodes, burning everything near it */
function ignition(e: Enemy, source: SourceId): void {
  const power = skillValues("k_flame").ignite;
  if (!power) return;
  e.burn = 0;
  const [cx, cy] = enemyCenter(e);
  explode(cx, cy, { radius: IGNITION_RADIUS, damage: progress.stats.ap * power, burn: 2, brands: 0, source });
}

/** Apply a hit: back attacks deal 1.5x, airborne foes take 2x, crits 1.75x, all stacking. Guards stop light sword blows. */
export function dealDamage(e: Enemy, base: number, o: HitOptions = {}): HitResult {
  if (e.hp <= 0) return "hit";
  const def = ENEMIES[e.type];
  const source = o.source ?? "attacks";
  let tag: DamageTag = o.dot ? "burn" : "normal";
  if (guards(e, o)) {
    if (!o.heavy) return block(e, base, source);
    e.stun = Math.max(e.stun, def.launchable ? GUARD.breakStun : GUARD.breakStun * 0.6);
    e.guardHits = 0;
    tag = "break";
  }
  const back = o.fromX !== undefined && isBehind(e, o.fromX);
  const crit = !o.dot && (!!o.sureCrit || rng.chance(progress.stats.crit));
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
  if (isHeroSource(source) && !o.dot) dmg *= 1 + hitBonus(e, { back, keen: !!o.sureCrit, melee: !!o.melee });
  dmg *= 1 + Math.min(DAMAGE.takenCap, takenBonus(e) + markBonus(e));
  dmg *= kit().damageScale?.() ?? 1;
  const shatterShards = o.melee && o.heavy && e.frozen > 0 ? (skillValues("k_frost").shatter ?? 0) : 0;
  const shattering = shatterShards > 0;
  if (shattering) {
    dmg *= 2;
    tag = "shatter";
  }
  dmg *= buildDamage();
  const value = Math.max(1, Math.round(dmg));
  e.hp -= value;
  recordDamage(source, value);
  const fromHero = isHeroSource(source);
  if (!o.dot && fromHero) addFlow(FLOW.perHit);
  e.flash = 0.1;
  e.guardHits = 0;
  // a skill's own hit is quiet and never drawn big, so a crowd of them does not drown out the hero's own
  const quiet = !fromHero;
  popNumber(e, value, tag, !quiet && (crit || shattering || (back && e.air)), quiet);
  if (shattering) shatter(e, shatterShards, source);
  e.vx += (o.kx ?? 0) * (1 - def.weight);
  if (o.spike && e.air) e.vy = ENEMY_AIR.spike;
  else if (o.launch && def.launchable) {
    const burning = e.burn > 0;
    launchEnemy(e, o.launch);
    if (burning) ignition(e, source);
  } else if (e.air && !o.dot) {
    e.airHits++;
    const hold = Math.max(0, 1 - e.airHits / JUGGLE_LIMIT);
    if (hold > 0) e.vy = Math.min(e.vy, ENEMY_AIR.juggle * hold);
  } else if (kindOf(e.type).flies && e.rank === "minion") e.vy += o.ky ?? 0;
  if (o.stun && def.launchable) e.stun = Math.max(e.stun, o.stun);
  if (o.stagger && kindOf(e.type).staggers) e.stagger = Math.max(e.stagger, o.stagger);
  if (o.heavy && e.state === "wind" && def.rank === "minion") Object.assign(e, { state: "recover", st: 0 });
  if (!o.dot && isHeroSource(source)) {
    emitSkillEvent({
      type: "blow",
      foe: e,
      damage: value,
      source,
      move: source === "attacks" ? hero.move : null,
      finisher: source === "attacks" && hero.chain >= progress.comboLimit,
      melee: !!o.melee,
      back,
      crit,
      airborne: e.air,
      keen: !!o.sureCrit,
    });
  }
  if (e.hp <= 0) killEnemy(e, source);
  return "hit";
}
