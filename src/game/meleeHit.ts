import { COMBO, GUARD, MP_PER_HIT } from "../constants/combat";
import { sfx } from "../services/audio";
import type { Enemy } from "../types/enemy";
import type { HitFeel } from "../types/move";
import type { Box } from "../types/world";
import { lerp } from "../utils/math";
import { dealDamage } from "./damage";
import { createImpact } from "./effects/impact";
import { enemyBox, enemyCenter } from "./enemies/enemy";
import { wallBounce } from "./enemies/wallBounce";
import { feat } from "./feat";
import { movePayoff, payoffLands } from "./skills/payoff";
import { game, hero, progress } from "./state";
import { boxHit, hitStop, markStruck, shake, struckThisSwing } from "./world";

export interface Blow {
  /** damage as a multiple of attack damage */
  power: number;
  kx: number;
  ky: number;
  launch?: number;
  spike?: boolean;
  stun?: number;
  big?: boolean;
  /** a foe driven into the stage edge bounces back off it */
  wall?: boolean;
  /** a Keen blow: always a critical hit */
  sureCrit?: boolean;
  /** a precise blow: `power` lands on the foe the current move's payoff reaches, and every other foe takes this */
  plain?: number;
  feel?: HitFeel;
}

const LIGHT_FEEL: HitFeel = { stop: 0.07, shake: [0.12, 1.5], pitch: 1 };
const BIG_FEEL: HitFeel = { stop: 0.13, shake: [0.2, 2.5], pitch: 1 };

/** a sword blow landed during Riposte: one blow fewer left of it */
function spendRiposte(): void {
  hero.riposteBlows--;
  if (hero.riposteBlows <= 0) hero.riposte = 0;
}

/** the foes the boxes reach that this swing has not struck yet, nearest first, so a precise payoff goes to the foe the
 *  blow was aimed at */
function reached(boxes: readonly Box[]): Enemy[] {
  return game.enemies
    .filter((e) => e.hp > 0 && !struckThisSwing(e) && boxes.some((b) => boxHit(b, enemyBox(e))))
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
}

/** Test boxes against every foe, once per swing; knockback points away from Kael. Guards stop light blows from the front.
 *  Returns how many foes were struck. */
export function meleeHit(boxes: readonly Box[], blow: Blow): number {
  let hits = 0;
  let blocked = 0;
  const riposte = hero.riposte > 0;
  for (const e of reached(boxes)) {
    markStruck(e);
    const power = blow.plain === undefined || payoffLands(movePayoff(), e) ? blow.power : blow.plain;
    const dir = Math.sign(e.x - hero.x) || hero.face;
    const [ex, ey] = enemyCenter(e);
    const result = dealDamage(e, progress.stats.ad * power, {
      fromX: hero.x,
      kx: blow.kx * dir,
      ky: blow.ky,
      launch: blow.launch,
      spike: blow.spike,
      stun: blow.stun,
      heavy: blow.big || riposte,
      melee: true,
      sureCrit: blow.sureCrit,
      stagger: COMBO.stagger,
    });
    hits++;
    hero.lastHit = e;
    if (result === "blocked") {
      blocked++;
      continue;
    }
    if (blow.wall) wallBounce(e, dir);
    game.fx.push(createImpact(lerp(hero.x + dir * 8, ex, 0.6), ey, dir, !!blow.big || riposte));
    hero.mp = Math.min(progress.stats.mp, hero.mp + MP_PER_HIT);
  }
  hero.moveHits += hits;
  if (riposte && hits > blocked) spendRiposte();
  if (blocked) hero.vx = -hero.face * GUARD.pushback;
  if (hits > blocked) {
    const feel = blow.feel ?? (blow.big ? BIG_FEEL : LIGHT_FEEL);
    hitStop(riposte ? Math.max(feel.stop, BIG_FEEL.stop) : feel.stop);
    shake(feel.shake[0], feel.shake[1]);
    sfx.hit(!!blow.big || riposte, feel.pitch);
    if (!hero.ground) hero.vy = Math.min(hero.vy, -40);
    feat({ kind: "comboHit", moves: hero.chain });
  } else if (blocked) hitStop(0.04);
  return hits;
}
