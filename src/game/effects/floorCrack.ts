import { EMBER } from "../../constants/characters/ysra/look";
import { fleck, glowLine, place, px } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import { grain } from "../../utils/grain";
import { clamp } from "../../utils/math";
import { rng } from "../state";

/** after the crack stops running it glows this long, then cools to dark and closes */
const GLOW = 0.6;
const COOL = 0.5;

export interface FloorCrack extends Effect {
  /** how far the crack has run from its start, toward each end */
  front(): number;
}

/** a glowing crack in the floor at y, running from x0 toward x1 at this speed, zigzagging a few pixels deep, lit in a
 *  ramp of seven steps (Ysra's ember unless given) */
export function createFloorCrack(x0: number, x1: number, y: number, speed: number, glowRamp: Ramp = EMBER): FloorCrack {
  const dir = Math.sign(x1 - x0) || 1;
  const len = Math.abs(x1 - x0);
  // how deep the crack sits at each pixel along it, and a short fork off it here and there
  const depth: number[] = [];
  let d = 1;
  for (let i = 0; i <= len; i++) {
    d = clamp(d + rng.int(-1, 1), 0, 3);
    depth.push(d);
  }
  const forks = Array.from({ length: Math.floor(len / 18) }, () => ({
    at: rng.int(4, Math.max(5, len)),
    dy: rng.int(2, 4),
  }));
  let ran = 0;
  let after = 0;
  return {
    front: () => ran,
    update(dt) {
      if (ran < len) {
        ran = Math.min(len, ran + speed * dt);
        return true;
      }
      after += dt;
      return after < GLOW + COOL;
    },
    drawBack() {
      place();
      const cool = clamp((after - GLOW) / COOL);
      const hot = cool > 0 ? glowRamp[Math.round(4 - cool * 4)] : glowRamp[5];
      for (let i = 0; i <= ran; i++) {
        // the last few pixels of a running crack burn white
        const running = ran < len && ran - i < 4;
        const c = running ? glowRamp[6] : hot;
        const cx = x0 + dir * i;
        // a cooling crack closes in patches
        if (cool > 0 && grain(i, len) < cool * 0.7) continue;
        px(cx, y + depth[i], c, 1 - cool * 0.5);
        px(cx, y + depth[i] + 1, glowRamp[2], 1 - cool);
        // a white hot seam down the middle while it glows, and a scorched lip above it
        if (cool <= 0 && !running && grain(i, 3) < 0.6) fleck(cx + 0.25, y + depth[i] + 0.75, glowRamp[6]);
        if (grain(i, 5) < 0.4) fleck(cx + 0.25, y + depth[i] - 0.25, glowRamp[1], 1 - cool);
      }
      for (const f of forks) {
        if (f.at > ran) continue;
        for (let j = 1; j <= f.dy; j++) px(x0 + dir * (f.at + (j % 2)), y + depth[f.at] + j, hot, 1 - cool * 0.6);
      }
      glowLine(x0, y + 1, x0 + dir * ran, y + 1, 6, glowRamp[3], 0.45 * (1 - cool));
    },
    draw() {},
  };
}
