import { MP_PER_HIT } from "../../../constants/combat";
import { ENEMIES } from "../../../constants/enemies";
import { sfx } from "../../../services/audio";
import type { AxeBlow } from "../../../types/brannoc";
import type { Enemy } from "../../../types/enemy";
import type { HitFeel } from "../../../types/move";
import type { Box } from "../../../types/world";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { feat } from "../../feat";
import { game, hero, progress } from "../../state";
import { boxHit, hitStop, shake } from "../../world";
import { afterAxeHit, blowScale, firstFoe, headsmanScale, outright, sureCrit } from "./blowSkills";
import { brannoc } from "./memory";

/** one blow of his axe as it strikes */
export interface AxeStrike {
  blow: AxeBlow;
  /** which hit of the blow: the Bloodied Cleave's second spin is 1, Spinning Reap's turns after it */
  hit: number;
  /** damage as a multiple of attack damage */
  power: number;
  kx: number;
  heavy: boolean;
  launch?: number;
  stagger: number;
  feel: HitFeel;
  /** a Bloodied blow */
  bloodied: boolean;
  /** every foe it strikes takes a sure crit (the warp's chop when the shared warp asks for one) */
  sure?: boolean;
}

/** a box from `near` to `far` ahead of him (negative is behind), from `low` to `high` above his feet */
export function axeBox(near: number, far: number, low: number, high: number): Box {
  const a = hero.x + hero.face * near;
  const z = hero.x + hero.face * far;
  return [Math.min(a, z), hero.y - high, Math.max(a, z), hero.y - low];
}

/** Reave carries a foe behind him round to this far in front */
function sweepRound(e: Enemy, to: number): void {
  if (Math.sign(e.x - hero.x) === hero.face || e.rank === "boss" || e.rank === "mini") return;
  e.x = hero.x + hero.face * to;
}

/** the side a struck foe is knocked to: Reave carries everything toward his front, the rest away from him */
const knockSide = (e: Enemy, s: AxeStrike): number =>
  s.blow === "reave" ? hero.face : Math.sign(e.x - hero.x) || hero.face;

/** one foe struck by an axe blow; false when a guard stopped it */
function strikeFoe(e: Enemy, s: AxeStrike, first: boolean, sweep: number): boolean {
  if (outright(e, s)) return true;
  const dir = knockSide(e, s);
  const launchable = ENEMIES[e.type].launchable;
  const payoff = first ? firstFoe(e, s) : null;
  const power = s.power * blowScale(e, s) * headsmanScale(e, s) * (payoff?.scale ?? 1);
  const hpBefore = e.hp;
  if (sweep > 0) sweepRound(e, sweep);
  const result = dealDamage(e, progress.stats.ad * power, {
    fromX: hero.x,
    kx: s.kx * dir,
    launch: s.launch && launchable && e.rank !== "boss" ? s.launch : undefined,
    heavy: s.heavy,
    melee: true,
    stagger: s.stagger,
    sureCrit: s.sure || payoff?.sureCrit || sureCrit(),
    stun: payoff?.stun || undefined,
  });
  if (result === "blocked") return false;
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx - dir * 3, cy, dir, s.heavy));
  hero.mp = Math.min(progress.stats.mp, hero.mp + MP_PER_HIT);
  hero.lastHit = e;
  afterAxeHit(e, s, { kill: hpBefore > 0 && e.hp <= 0, payoff });
  return true;
}

/**
 * The blow strikes every foe in its box that `struck` has not marked yet, nearest first, marking each. Reave sweeps a
 * foe behind him round to his front (`sweep` pixels). Returns the foes it landed on.
 */
export function strikeAxe(
  s: AxeStrike,
  box: Box,
  struck: (e: Enemy) => boolean,
  mark: (e: Enemy) => void,
  sweep = 0,
): Enemy[] {
  const foes = game.enemies
    .filter((e) => e.hp > 0 && !struck(e) && boxHit(box, enemyBox(e)))
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
  const landed: Enemy[] = [];
  let blocked = 0;
  for (const e of foes) {
    mark(e);
    if (strikeFoe(e, s, !landed.length, sweep)) landed.push(e);
    else blocked++;
  }
  hero.moveHits += landed.length + blocked;
  if (landed.length) {
    brannoc.glint = 2 / 30;
    hitStop(s.feel.stop);
    shake(s.feel.shake[0], s.feel.shake[1]);
    sfx.hit(s.heavy, s.feel.pitch);
    feat({ kind: "comboHit", moves: hero.chain });
  } else if (blocked) hitStop(0.04);
  return landed;
}
