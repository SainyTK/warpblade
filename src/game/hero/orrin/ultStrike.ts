import { PAL, SPARKS, WORLD_COLORS } from "../../../constants/palette";
import { ULT_LEVELS, ULT_REACH } from "../../../constants/ultimate";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { dust, hitStop, shake } from "../../world";
import { skin } from "../skin";
import { orrin } from "./memory";

/** the power of the ultimate's level, as attack damage */
export const levelPower = (): number => ULT_LEVELS[Math.max(0, orrin.ultLevel - 1)].power * progress.stats.ad;

/** one foe struck by a pass of the ultimate, for a share of the level's power */
export function ultHit(e: Enemy, share: number, fromX: number): void {
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, levelPower() * share, {
    fromX,
    kx: Math.sign(cx - fromX) * 120,
    ky: -60,
    heavy: true,
    source: "ultimate",
  });
  game.fx.push(createImpact(cx, cy, Math.sign(cx - fromX) || 1, true, SPARKS.brass));
}

/** the crash at the end: a brass and volt ring that deals `share` of the level's power to every foe in its reach */
export function crashRing(share: number, reach = ULT_REACH[Math.max(0, orrin.ultLevel - 1)]): void {
  const h = hero;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx] = enemyCenter(e);
    if (Math.abs(cx - h.x) > reach) continue;
    ultHit(e, share, h.x);
  }
  game.fx.push(createFloorRing(h.x, h.y, Math.min(reach, 160), skin.ramp, 0.5));
  game.fx.push(createFloorRing(h.x, h.y, Math.min(reach, 160) * 0.7, PAL.volt, 0.4));
  lights.add(h.x, h.y - 10, 90, PAL.brass[3], 0.9, 0.4);
  dust(h.x, h.y, 12);
  for (let i = 0; i < 10; i++)
    particles.spawn(
      PK.SHARD,
      h.x + rng.range(-8, 8),
      h.y - 2,
      rng.range(-110, 110),
      -rng.range(80, 200),
      rng.range(0.4, 0.8),
      {
        col: WORLD_COLORS.dust,
      },
    );
  hitStop(0.08);
  shake(0.3, 4);
  sfx.boom();
}
