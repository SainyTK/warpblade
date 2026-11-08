import { CHAIN_BLOWS } from "../../../constants/orrin/string";
import { sfx } from "../../../services/audio";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createShockwave } from "../../effects/shockwave";
import { enemyCenter } from "../../enemies/enemy";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { newSwing, shake, surfaceBelow } from "../../world";
import { skin } from "../skin";
import { giveArcBack } from "./airArc";
import { sweepChain } from "./chainHit";
import { orrin } from "./memory";

const SNAP = "o_reelsnap";

/**
 * Reel Snap: a reel that has sped him up enough snaps the chain at every foe near him, once a reel. Low in the arc it
 * sends a shock along the floor; evolved, every snap is a Full Circle round the swing point.
 */
export function reelSnap(): void {
  if (orrin.snapped) return;
  orrin.snapped = true;
  const v = skillValues(SNAP);
  const radius = withCharms("area", v.radius);
  const [x, y] = [hero.x, hero.y - 16];
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - x, cy - y) > radius) continue;
    dealDamage(e, progress.stats.ad * v.power, {
      fromX: x,
      kx: Math.sign(cx - x) * 120,
      stun: v.stun || undefined,
      melee: true,
      heavy: true,
      source: SNAP,
    });
  }
  game.fx.push(createFloorRing(x, y, radius, skin.ramp, 0.3, 1));
  shake(0.12, 2);
  sfx.hit(true, 1.3);
  if (v.arc) giveArcBack(false);
  const at = orrin.latchAt;
  const low = !!at && hero.y > at.y + orrin.length * 0.8;
  if (v.shock && low) {
    const floor = surfaceBelow(hero.x, hero.y);
    game.fx.push(createShockwave(hero.x, floor, progress.stats.ad * v.power * 0.6, skin.ramp, 70, 0.4));
  }
  if (v.whiplash) {
    newSwing();
    sweepChain({ spec: CHAIN_BLOWS.circle, blow: "circle" }, 0, TAU);
  }
}
