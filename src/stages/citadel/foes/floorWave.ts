import { GROUND } from "../../../constants/stage";
import { fleck, glow, hairline, place, px } from "../../../engine/frame";
import { stageLeft, stageRight } from "../../../game/adventure";
import { VOID, VOID_SPARKS } from "../../../game/enemies/abyss/colors";
import { fxRng, particles } from "../../../game/state";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { strikeOnce } from "./strike";

export interface FloorWaveShape {
  speed: number;
  height: number;
  reach: number;
}

const CREST = 18;
const HALF = 4;

export function createFloorWave(x: number, dir: number, damage: number, shape: FloorWaveShape): Effect {
  let t = 0;
  let front = x;
  const life = shape.reach / shape.speed;
  const struck = new Set<number>();
  const height = () => shape.height * clamp(t / 0.06) * clamp((life - t) / 0.25);
  return {
    update(dt) {
      t += dt;
      front += dir * shape.speed * dt;
      if (front < stageLeft() + 2 || front > stageRight() - 2) return false;
      const h = height();
      strikeOnce(struck, [front - HALF, GROUND - h, front + HALF, GROUND], damage, front - dir * 8);
      if (fxRng.chance(0.6))
        particles.spawn(PK.SPARK, front, GROUND - 1, -dir * fxRng.range(10, 50), -fxRng.range(40, 110), 0.3, {
          sparks: VOID_SPARKS,
        });
      return t < life;
    },
    draw() {
      place();
      const h = height();
      for (let back = 0; back < CREST; back += 0.5) {
        const bx = front - dir * back;
        const k = 1 - back / CREST;
        const rise = back < 3 ? 0.75 + back * 0.08 : k * 1.05;
        const hh = h * rise * (0.85 + 0.15 * Math.sin(back * 0.9 + t * 30));
        if (hh < 0.5) continue;
        hairline(bx, GROUND, bx, GROUND - hh, VOID[1]);
        hairline(bx, GROUND - hh * 0.55, bx, GROUND - hh, VOID[3]);
        hairline(bx, GROUND - hh * 0.85, bx, GROUND - hh, back < 4 ? VOID[5] : VOID[4]);
      }
      px(front, GROUND - h, VOID[4]);
      fleck(front + dir, GROUND - h - 1, VOID[5]);
      hairline(front - dir * 26, GROUND + 0.5, front, GROUND + 0.5, VOID[2], 0.8);
      glow(front - dir * 5, GROUND - 4, 14, VOID[3], 0.45);
    },
  };
}
