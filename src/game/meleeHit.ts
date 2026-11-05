import { COMBO, FUSION, GUARD, MP_PER_HIT, RIPOSTE } from "../constants/combat";
import { sfx } from "../services/audio";
import type { Enemy } from "../types/enemy";
import type { HitFeel } from "../types/move";
import type { Box } from "../types/world";
import { lerp } from "../utils/math";
import { dealDamage, isBehind } from "./damage";
import { createEcho } from "./effects/echo";
import { createImpact } from "./effects/impact";
import { enemyBox, enemyCenter } from "./enemies/enemy";
import { wallBounce } from "./enemies/wallBounce";
import { hasPerk } from "./progress";
import { createLightning } from "./spells/lightning";
import { game, hero, progress } from "./state";
import { boxHit, hitStop, shake } from "./world";

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
  feel?: HitFeel;
}

const LIGHT_FEEL: HitFeel = { stop: 0.07, shake: [0.12, 1.5], pitch: 1 };
const BIG_FEEL: HitFeel = { stop: 0.13, shake: [0.2, 2.5], pitch: 1 };

/** Static Step: a charged foe calls lightning down on itself when the sword lands */
function discharge(e: Enemy): void {
  e.charged = 0;
  const [cx, cy] = enemyCenter(e);
  const ap = progress.stats.ap;
  game.fx.push(
    createLightning(e, [cx, cy], { damage: ap * FUSION.staticStrike, arcDamage: ap, arcs: 1, shock: 0.6, glow: 0.6 }),
  );
}

/** Test boxes against every foe, once per swing; knockback points away from Kael. Guards stop light blows from the front.
 *  Returns how many foes were struck. */
export function meleeHit(boxes: readonly Box[], blow: Blow): number {
  let hits = 0;
  let blocked = 0;
  const riposte = hero.riposte > 0;
  const power = blow.power * (riposte ? RIPOSTE.power : 1);
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.swing === game.swing || !boxes.some((b) => boxHit(b, enemyBox(e)))) continue;
    e.swing = game.swing;
    const dir = Math.sign(e.x - hero.x) || hero.face;
    const [ex, ey] = enemyCenter(e);
    const fromBehind = isBehind(e, hero.x);
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
    hero.mp = Math.min(progress.stats.mp, hero.mp + MP_PER_HIT * (hasPerk("siphon") ? 3 : 1));
    if (e.charged > 0 && hasPerk("staticStep")) discharge(e);
    if (fromBehind && hasPerk("phantomEdge") && e.hp > 0)
      game.fx.push(createEcho(e, progress.stats.ad * power * FUSION.echo, hero.face));
  }
  hero.moveHits += hits;
  if (riposte && hits) hero.riposte = 0;
  if (blocked) hero.vx = -hero.face * GUARD.pushback;
  if (hits > blocked) {
    const feel = blow.feel ?? (blow.big ? BIG_FEEL : LIGHT_FEEL);
    hitStop(riposte ? Math.max(feel.stop, BIG_FEEL.stop) : feel.stop);
    shake(feel.shake[0], feel.shake[1]);
    sfx.hit(!!blow.big || riposte, feel.pitch);
    if (!hero.ground) hero.vy = Math.min(hero.vy, -40);
  } else if (blocked) hitStop(0.04);
  return hits;
}
