import { COMBO, MP_PER_HIT } from "../../../constants/combat";
import { ENEMIES } from "../../../constants/enemies";
import { KNIFE_BLOWS, type KnifeBlowSpec } from "../../../constants/tallis/knives";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { KnifeBlow } from "../../../types/tallis";
import type { Box } from "../../../types/world";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { feat } from "../../feat";
import { game, hero, progress } from "../../state";
import { boxHit, hitStop, shake } from "../../world";
import { ambushOpen, takeAmbush } from "./ambush";
import { behindOf } from "./backOpen";
import { afterKnifeHit, ambushPower, blowScale, executes } from "./blowSkills";
import { isMarked, strikeFrom } from "./marks";

/** one blow of his knives as it strikes */
export interface KnifeStrike {
  blow: KnifeBlow;
  spec: KnifeBlowSpec;
  /** a multiple on top of the blow's power: a skill's bonus */
  scale: number;
  /** it counts as from behind wherever he stands (Drop Stab) */
  fromBehind?: boolean;
  /** drives a foe in the air into the floor (Plunge) */
  spike?: boolean;
}

/** the strike of a blow of his, from where he stands now */
export const knifeStrike = (blow: KnifeBlow, fromBehind = false): KnifeStrike => ({
  blow,
  spec: KNIFE_BLOWS[blow],
  scale: blowScale(blow),
  fromBehind,
});

/** the blow's box in the world, ahead of him */
export function strikeBox(spec: KnifeBlowSpec): Box {
  const a = hero.x + hero.face * spec.near;
  const b = hero.x + hero.face * spec.far;
  const mid = hero.y - spec.y;
  return [Math.min(a, b), mid - spec.height / 2, Math.max(a, b), mid + spec.height / 2];
}

/** whether a blow on this foe counts as from behind */
export const fromBehindOn = (e: Enemy, s: KnifeStrike): boolean => !!s.fromBehind || isMarked(e) || behindOf(e);

/** one foe struck by a knife blow; false when a guard stopped it. The Ambush, if one is open, lands on this foe. */
export function strikeFoe(e: Enemy, s: KnifeStrike, ambush: boolean): boolean {
  const { spec } = s;
  const back = fromBehindOn(e, s);
  const dir = spec.away ? hero.face : Math.sign(e.x - hero.x) || hero.face;
  const launchable = ENEMIES[e.type].launchable;
  const power = spec.power * s.scale * (ambush ? 1 + ambushPower() : 1) * (back ? executes(e) : 1);
  const hpBefore = e.hp;
  const result = dealDamage(e, progress.stats.ad * power, {
    fromX: strikeFrom(e, hero.x, s.fromBehind),
    kx: spec.kx * dir,
    launch: spec.launch && launchable ? spec.launch : undefined,
    spike: s.spike,
    heavy: spec.heavy,
    melee: true,
    sureCrit: ambush,
    // every knife blow rocks the foe like any hero's string, so a walker it lands on stops hurting by touch
    stagger: spec.stagger ?? COMBO.stagger,
  });
  if (result === "blocked") return false;
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx - dir * 3, cy, dir, s.blow === "backstab" || s.blow === "gutSlash" || ambush));
  hero.mp = Math.min(progress.stats.mp, hero.mp + MP_PER_HIT);
  hero.lastHit = e;
  // a knife that lands on a winding minion cuts its wind-up short, as a heavy blow does for every hero
  if (e.hp > 0 && e.rank === "minion" && e.state === "wind") Object.assign(e, { state: "recover", st: 0 });
  afterKnifeHit(e, s, { back, ambush, kill: hpBefore > 0 && e.hp <= 0, power });
  return true;
}

/**
 * The blow strikes every foe in its box that `struck` has not marked yet, nearest first, marking each; an open Ambush
 * lands on the first it reaches. Returns the foes it landed on.
 */
export function strikeKnife(s: KnifeStrike, struck: (e: Enemy) => boolean, mark: (e: Enemy) => void): Enemy[] {
  const box = strikeBox(s.spec);
  const foes = game.enemies
    .filter((e) => e.hp > 0 && !struck(e) && boxHit(box, enemyBox(e)))
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
  const landed: Enemy[] = [];
  let blocked = 0;
  for (const e of foes) {
    mark(e);
    // the Ambush is spent only by a blow that lands, never by one a guard stops
    const ambush = !landed.length && ambushOpen();
    if (!strikeFoe(e, s, ambush)) {
      blocked++;
      continue;
    }
    if (ambush) takeAmbush();
    landed.push(e);
  }
  hero.moveHits += landed.length + blocked;
  if (landed.length) {
    hitStop(s.spec.stop ?? 0.03);
    shake(0.08, s.spec.shake ?? 1);
    sfx.hit(!!s.spec.heavy, s.blow === "flick" || s.blow === "twist" ? 1.4 : 1.15);
    feat({ kind: "comboHit", moves: hero.chain });
  } else if (blocked) hitStop(0.04);
  return landed;
}
