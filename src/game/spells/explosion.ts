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
import { fxRng, game, lights, particles, rng } from "../state";
import { dust, hitStop, shake } from "../world";

/** the shake and hit-stop of a full-size burst */
const FULL = { brands: 4, shake: 0.28, amp: 3, hitStop: 0.06 } as const;

/** the light of a burst: a wide orange flare and a small white core, dim enough that the flames and the foes in them
 *  keep their shapes */
const BLAST_LIGHT = { radius: 70, color: hex("#ff8a2a"), strength: 0.5, core: 12, coreStrength: 0.5 } as const;

/** A white core, rolling flame that cools into smoke, sparks, burning chunks that set the floor alight. */
export function explode(x: number, y: number, blast: Blast): void {
  const { radius, damage, burn } = blast;
  const brands = blast.brands ?? FULL.brands;
  const k = radius / 42;
  lights.add(x, y - 6, BLAST_LIGHT.radius * k, BLAST_LIGHT.color, BLAST_LIGHT.strength, 0.6);
  lights.add(x, y - 6, BLAST_LIGHT.core, WHITE, BLAST_LIGHT.coreStrength, 0.12);
  for (let i = 0; i < 30 * k; i++) {
    const a = fxRng.range(Math.PI, TAU) + fxRng.range(-0.4, 0.4);
    const sp = fxRng.range(30, 150) * k;
    const flag = fxRng.chance(0.7) ? PF.SMOKES | (fxRng.chance(0.4) ? PF.BIG : 0) : 0;
    particles.spawn(PK.FIRE, x, y - 4, Math.cos(a) * sp, Math.sin(a) * sp * 0.8, fxRng.range(0.3, 0.7), {
      col: 0,
      size: fxRng.range(2, 3.6),
      flag,
    });
  }
  for (let i = 0; i < 20; i++) {
    const a = fxRng.range(Math.PI * 1.05, Math.PI * 1.95);
    const sp = fxRng.range(160, 400);
    particles.spawn(PK.SPARK, x, y - 4, Math.cos(a) * sp, Math.sin(a) * sp, fxRng.range(0.25, 0.7));
  }
  for (let i = 0; i < brands; i++)
    particles.spawn(PK.BRAND, x, Math.min(y - 6, GROUND - 6), rng.range(-130, 130), rng.range(-240, -130), 3);
  for (let i = 0; i < 8; i++)
    particles.spawn(
      PK.EMBER,
      x + fxRng.range(-10, 10),
      y - fxRng.range(2, 14),
      fxRng.range(-30, 30),
      fxRng.range(-60, -20),
      fxRng.range(0.8, 1.6),
      {
        delay: fxRng.range(0.1, 0.4),
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
