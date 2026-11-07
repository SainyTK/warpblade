import { FIRE_RAMP } from "../../constants/palette";
import { GROUND } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { Blast } from "../../types/effect";
import { PF, PK } from "../../types/particle";
import { hex, WHITE } from "../../utils/color";
import { TAU } from "../../utils/math";
import { dealDamage } from "../damage";
import { createBlastCore } from "../effects/flash";
import { createFloorRing } from "../effects/floorRing";
import { markBurner } from "../enemies/burn";
import { enemyCenter } from "../enemies/enemy";
import { game, lights, particles, rng } from "../state";
import { dust, hitStop, shake } from "../world";

/** the shake and hit-stop of a full-size burst */
const FULL = { brands: 4, shake: 0.28, amp: 3, hitStop: 0.06 } as const;

/** A white core, rolling flame that cools into smoke, sparks, burning chunks that set the floor alight. */
export function explode(x: number, y: number, blast: Blast): void {
  const { radius, damage, burn } = blast;
  const brands = blast.brands ?? FULL.brands;
  const R = rng;
  const k = radius / 42;
  lights.add(x, y - 6, 80 * k, hex("#ff8a2a"), 1, 0.6);
  lights.add(x, y - 6, 26, WHITE, 0.9, 0.12);
  for (let i = 0; i < 30 * k; i++) {
    const a = R.range(Math.PI, TAU) + R.range(-0.4, 0.4);
    const sp = R.range(30, 150) * k;
    const flag = R.chance(0.7) ? PF.SMOKES | (R.chance(0.4) ? PF.BIG : 0) : 0;
    particles.spawn(PK.FIRE, x, y - 4, Math.cos(a) * sp, Math.sin(a) * sp * 0.8, R.range(0.3, 0.7), {
      col: 0,
      size: R.range(2, 3.6),
      flag,
    });
  }
  for (let i = 0; i < 20; i++) {
    const a = R.range(Math.PI * 1.05, Math.PI * 1.95);
    const sp = R.range(160, 400);
    particles.spawn(PK.SPARK, x, y - 4, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.25, 0.7));
  }
  for (let i = 0; i < brands; i++)
    particles.spawn(PK.BRAND, x, Math.min(y - 6, GROUND - 6), R.range(-130, 130), R.range(-240, -130), 3);
  for (let i = 0; i < 8; i++)
    particles.spawn(
      PK.EMBER,
      x + R.range(-10, 10),
      y - R.range(2, 14),
      R.range(-30, 30),
      R.range(-60, -20),
      R.range(0.8, 1.6),
      {
        delay: R.range(0.1, 0.4),
      },
    );
  dust(x, y, 8);
  game.fx.push(createFloorRing(x, y, radius * 1.1, [...FIRE_RAMP].reverse(), 0.45));
  game.fx.push(createBlastCore(x, y - 6, FIRE_RAMP[1]));
  for (const e of game.enemies) {
    const [ex, ey] = enemyCenter(e);
    const d = Math.hypot(ex - x, ey - y);
    if (d >= radius) continue;
    dealDamage(e, damage * (1 - d / (radius * 2)), {
      fromX: x,
      kx: Math.sign(ex - x) * 200,
      ky: -120,
      heavy: true,
      stun: blast.stun,
      source: blast.source,
    });
    e.burn = burn;
    markBurner(e);
  }
  hitStop(blast.hitStop ?? FULL.hitStop);
  shake(blast.shake ?? FULL.shake, blast.amp ?? FULL.amp);
  sfx.boom();
}
