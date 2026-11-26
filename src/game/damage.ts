import { FOE_MATERIAL } from "../constants/audio";
import { DAMAGE, ENEMY_AIR, GUARD, IGNITION_RADIUS, JUGGLE_LIMIT, SHATTER_REACH } from "../constants/combat";
import { HERO_SOURCES } from "../constants/damageSources";
import { ENEMIES } from "../constants/enemies";
import { FLOW } from "../constants/growth";
import { SPARKS } from "../constants/palette";
import { sfx } from "../services/audio";
import type { SourceId } from "../types/build";
import type { Enemy } from "../types/enemy";
import type { DamageTag } from "../types/game";
import type { HitLook } from "../types/hit";
import { isHeroSource } from "../utils/sources";
import { recordStageDamage } from "./adventure";
import { bossDeflects } from "./bossFight";
import { addFlow, flowDamage } from "./build/flow";
import { currentBuildStats } from "./build/stats";
import { recordDamage } from "./damageLedger";
import { createImpact } from "./effects/impact";
import { launchEnemy } from "./enemies/airborne";
import { foeSees } from "./enemies/awareness";
import { enemyCenter } from "./enemies/enemy";
import { kindOf } from "./enemies/kinds";
import { markBonus } from "./enemies/skillStatus";
import { staggerFoe } from "./enemies/stagger";
import { kit } from "./hero/kits";
import { countHit } from "./hitCount";
import { landHit } from "./hitFeel";
import { killEnemy } from "./kill";
import { popNumber } from "./numbers";
import { resonanceTaken, resonate } from "./resonance";
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
  /** comes round a guard: guards never stop it */
  curls?: boolean;
  /** a minion staggers for this long: its action is cut and it cannot act */
  stagger?: number;
  /** a Keen blow: always a critical hit */
  sureCrit?: boolean;
  finisher?: boolean;
  /** burning and other damage over time: no crits, no numbers in white */
  dot?: boolean;
  /** a hit that builds no Flow though it counts for the hero's own source (a summon's bite) */
  noFlow?: boolean;
  proc?: number;
  /** what dealt the hit, for the end of run screen: the hero's own blows when not given, a skill's id for a hit the
   *  skill deals on its own (it builds no Flow) */
  source?: SourceId;
  look?: HitLook;
}
/** what a blow did: landed, or stopped by a guard */
export type HitResult = "hit" | "blocked";

/** Might and Flow multiply every hit, whatever its source */
const buildDamage = (): number => currentBuildStats().might * flowDamage();

/** a foe struck from the side it is not facing */
export function isBehind(e: Enemy, fromX: number): boolean {
  const side = Math.sign(fromX - e.x);
  return side !== 0 && side !== e.face;
}

/** guarding kinds (husks from wave 3, mini bosses) hold up a guard while they walk, facing the blow; a staggered foe
 *  cannot raise it, nor one that cannot see the hero (game/enemies/awareness.ts) */
function guards(e: Enemy, o: HitOptions): boolean {
  if (!o.melee || o.curls || o.fromX === undefined) return false;
  const kind = kindOf(e.type);
  if (kind.guarding && !kind.guarding(e)) return false;
  if (kind.guardFrom === undefined || game.wave < kind.guardFrom) return false;
  return (
    e.state === kind.rest &&
    !e.air &&
    e.stun <= 0 &&
    e.stagger <= 0 &&
    e.frozen <= 0 &&
    e.shock <= 0 &&
    foeSees(e) &&
    !isBehind(e, o.fromX)
  );
}

/** a blocked blow: a little chip damage and sparks */
function block(e: Enemy, base: number, source: SourceId): HitResult {
  const value = Math.max(1, Math.round(base * GUARD.chip));
  recordStageDamage(e, value);
  e.hp -= value;
  recordDamage(source, value);
  popNumber(e, value, "block", false, !HERO_SOURCES.has(source));
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx + e.face * 6, cy - 4, -e.face, false, SPARKS.hot));
  sfx.block();
  e.guardHits++;
  if (e.hp <= 0) killEnemy(e, source);
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
  if (bossDeflects(e)) return "blocked";
  const def = ENEMIES[e.type];
  const source = o.source ?? "attacks";
  let tag: DamageTag = o.dot ? "burn" : "normal";
  if (guards(e, o)) {
    if (!o.heavy && e.guardHits + 1 < GUARD.breakAfter) {
      // the blocked blow still rocks the foe, so it cannot walk on or wind up before the string's next blow
      if (o.stagger) staggerFoe(e, o.stagger);
      return block(e, base, source);
    }
    // a heavy blow knocks the guard down; the second light blow in a row only opens it
    if (o.heavy) e.stun = Math.max(e.stun, def.launchable ? GUARD.breakStun : GUARD.breakStun * 0.6);
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
  if (isHeroSource(source) && !o.dot)
    dmg *= 1 + (kit().hitBonus?.(e, { back, keen: !!o.sureCrit, melee: !!o.melee }) ?? 0);
  dmg *= 1 + Math.min(DAMAGE.takenCap, (kit().takenBonus?.(e) ?? 0) + markBonus(e));
  dmg *= kit().damageScale?.() ?? 1;
  const shatterShards = o.melee && o.heavy && e.frozen > 0 ? (skillValues("k_frost").shatter ?? 0) : 0;
  const shattering = shatterShards > 0;
  if (shattering) {
    dmg *= 2;
    tag = "shatter";
  }
  dmg *= buildDamage() * resonanceTaken(e);
  dmg = kindOf(e.type).takes?.(e, dmg, !o.dot && isHeroSource(source)) ?? dmg;
  const value = Math.max(1, Math.round(dmg));
  recordStageDamage(e, value);
  e.hp -= value;
  recordDamage(source, value);
  const fromHero = isHeroSource(source);
  if (!o.dot && fromHero && !o.noFlow) {
    addFlow(FLOW.perHit);
    countHit();
  }
  e.flash = 0.1;
  e.guardHits = 0;
  if (o.melee && fromHero) sfx.strike(FOE_MATERIAL[e.type] ?? "flesh", !!o.heavy || !!o.finisher, crit);
  // a skill's own hit is quiet and never drawn big, so a crowd of them does not drown out the hero's own
  const quiet = !fromHero;
  popNumber(e, value, tag, !quiet && (crit || shattering || (back && e.air)), quiet, !!o.heavy || !!o.finisher);
  if (!o.dot) landHit(e, { look: o.look, crit, heavy: !!o.heavy || !!o.finisher, fromX: o.fromX });
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
  if (o.stagger) staggerFoe(e, o.stagger);
  if (o.heavy && e.state === "wind" && def.rank === "minion") Object.assign(e, { state: "recover", st: 0 });
  if (!o.dot && isHeroSource(source)) {
    kit().landed?.(e, { crit, kill: e.hp <= 0 });
    emitSkillEvent({
      type: "blow",
      foe: e,
      damage: value,
      source,
      move: source === "attacks" ? hero.move : null,
      finisher: source === "attacks" && (o.finisher ?? hero.chain >= progress.comboLimit),
      melee: !!o.melee,
      back,
      crit,
      airborne: e.air,
      keen: !!o.sureCrit,
    });
  }
  if (!o.dot) resonate({ foe: e, damage: value, source, depth: o.proc ?? 0 });
  if (e.hp <= 0) killEnemy(e, source);
  return "hit";
}
