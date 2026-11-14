import { RES } from "../../../../constants/stage";
import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { DAWN_RAMP, DAWN_SPARKS } from "../../constants/light";

/** a wave's flight: speed, the ground it covers, its half height, and whether it passes through every foe it meets */
export interface WaveSpec {
  speed: number;
  reach: number;
  half: number;
  damage: number;
  source?: SourceId;
  /** pushes each foe it cuts this hard */
  kx?: number;
  /** the foe it stops at, when it does not pierce: false stops at the first */
  pierce: boolean;
  /** climbs this many px for each px it flies */
  rise?: number;
}

/**
 * A crescent of dawn light that flies ahead and cuts each foe it meets once: Radiance's wave and the waves his skills
 * throw. It is light, not a sword blow, so guards do not stop it.
 */
export function createLightWave(x: number, y: number, face: number, spec: WaveSpec): Effect {
  const o = { x, y, travelled: 0, done: false };
  const struck = new Set<Enemy>();
  return {
    update(dt) {
      const step = spec.speed * dt;
      o.x += face * step;
      o.travelled += step;
      o.y += (spec.rise ?? 0) * step;
      const y = o.y;
      for (const e of game.enemies) {
        if (o.done || struck.has(e) || e.hp <= 0) continue;
        if (!boxHit([o.x - 3, y - spec.half, o.x + 3, y + spec.half], enemyBox(e))) continue;
        struck.add(e);
        dealDamage(e, spec.damage, { fromX: o.x - face * 8, kx: face * (spec.kx ?? 40), source: spec.source });
        game.fx.push(createImpact(o.x, y, face, false, DAWN_SPARKS));
        if (!spec.pierce) o.done = true;
      }
      return !o.done && o.travelled < spec.reach;
    },
    draw() {
      place();
      const k = 1 - o.travelled / spec.reach;
      const y = o.y;
      const rows = Math.round(spec.half * RES);
      for (let j = -rows; j <= rows; j++) {
        const v = j / rows;
        const bow = (1 - v * v) * 3;
        const front = o.x + face * bow;
        const row = y + j / RES;
        fleck(front, row, WHITE, k + 0.3);
        fleck(front - face / RES, row, DAWN_RAMP[5], k + 0.2);
        fleck(front - (2 * face) / RES, row, DAWN_RAMP[4], k);
        fleck(front - (3 * face) / RES, row, DAWN_RAMP[3], k * 0.7);
      }
      hairline(o.x, y, o.x - face * 10, y, DAWN_RAMP[4], (u) => k * (1 - u));
      glow(o.x, y, spec.half + 4, DAWN_RAMP[4], 0.35 * k);
    },
  };
}
