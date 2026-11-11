import { ULT_LEVELS } from "../../constants/ultimate";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { dealDamage } from "../damage";
import { createCrossbowBolt } from "../effects/crossbowBolt";
import { createImpact } from "../effects/impact";
import { enemyCenter } from "../enemies/enemy";
import { skin } from "../hero/skin";
import { game, hero, progress, rng } from "../state";
import { shake, surfaceBelow } from "../world";
import { foesOnSegment } from "./segmentHits";
import { ultSpan, ultTargets } from "./targets";

/** bolts that rain on open floor besides the ones on each foe, at each level */
const LOOSE = [6, 9, 12, 18] as const;
/** the rain starts after the bolt shot into the sky and lasts this long */
const FROM = 0.22;
const SPAN = 0.6;
const FALL_SPEED = 520;

/** Bolt Storm: she shoots one bolt into the sky and a rain of them comes down on every foe in reach and the floor
 *  around them. Each foe takes the level's power once, from the first bolt to reach it. */
export function castBoltStorm(level: number): void {
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ad;
  const struck = new Set<Enemy>();
  game.fx.push(
    createCrossbowBolt({
      x: hero.x + hero.face * 6,
      y: hero.y - 26,
      angle: -Math.PI / 2 + hero.face * 0.12,
      ramp: skin.ramp,
      primed: true,
      heavy: true,
      bounces: 0,
      range: 200,
      pass: () => false,
    }),
  );
  sfx.swing(1.4);
  const [x0, x1] = ultSpan(level);
  const aims = [
    ...ultTargets(level).map((e) => enemyCenter(e)[0]),
    ...Array.from({ length: LOOSE[level - 1] }, () => rng.range(x0, x1)),
  ];
  aims.forEach((x, i) => {
    const floor = surfaceBelow(x, 0);
    const slant = rng.range(0.15, 0.3) * (rng.chance(0.5) ? 1 : -1);
    const top = -20;
    game.fx.push(
      createCrossbowBolt({
        x: x - slant * (floor - top),
        y: top,
        angle: Math.atan2(floor - top, slant * (floor - top)),
        ramp: skin.ramp,
        primed: i < 4,
        // the storm's bolts are drawn long and thick, so the rain reads as an ultimate's
        heavy: true,
        bounces: 0,
        delay: FROM + (i * SPAN) / aims.length,
        speed: FALL_SPEED,
        range: 400,
        pass(ax, ay, bx, by) {
          for (const e of foesOnSegment(ax, ay, bx, by, struck)) {
            struck.add(e);
            const [cx, cy] = enemyCenter(e);
            dealDamage(e, damage, {
              fromX: cx - slant * 10,
              kx: 0,
              ky: -40,
              stun: 0.4,
              heavy: true,
              source: "ultimate",
            });
            game.fx.push(createImpact(cx, cy, Math.sign(slant) || 1, true));
            sfx.hit(true, 1.2);
            shake(0.06, 1);
          }
          return false;
        },
      }),
    );
  });
}
