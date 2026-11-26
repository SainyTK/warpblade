import { GROUND } from "../../../../constants/stage";
import { fleck, glow, place, px } from "../../../../engine/frame";
import { fxRng } from "../../../../game/state";
import { dust, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { clamp } from "../../../../utils/math";
import { BLIGHT } from "../../colors";
import { strikeOnce } from "../../spores";
import { drawVine } from "./drawVine";
import { LASH_SPEED } from "./moves";

const FRONT = { ahead: 5, behind: 12, height: 9 } as const;
const RETRACT = 0.4;
const MARK_STEP = 9;

export function createVineLash(x0: number, dir: number, end: number, delay: number, damage: number): Effect {
  const span = Math.abs(end - x0);
  const travel = span / LASH_SPEED;
  const struck = new Set<number>();
  let t = 0;
  let cracked = false;
  const reach = (): number => {
    const u = t - delay;
    if (u < 0) return 0;
    if (u < travel) return u * LASH_SPEED;
    return span * (1 - clamp((u - travel) / RETRACT));
  };
  return {
    update(dt) {
      t += dt;
      const u = t - delay;
      if (u < 0) return true;
      if (!cracked) {
        cracked = true;
        sfx.swing(0.8);
        shake(0.1, 1.5);
      }
      if (u < travel) {
        const front = x0 + dir * reach();
        const a = front - dir * FRONT.behind;
        const b = front + dir * FRONT.ahead;
        strikeOnce(
          struck,
          [Math.min(a, b), GROUND - FRONT.height, Math.max(a, b), GROUND + 2],
          damage,
          front - dir * 8,
        );
        if (fxRng.chance(0.6)) dust(front, GROUND, 1, dir);
      }
      return u < travel + RETRACT;
    },
    drawBack() {
      place();
      const warn = clamp(t / Math.max(0.01, delay));
      if (t < delay + 0.1) {
        const count = Math.floor(span / MARK_STEP);
        for (let i = 1; i <= count; i++) {
          const lit = i / count <= warn;
          if (!lit) continue;
          const x = x0 + dir * i * MARK_STEP;
          const blink = warn > 0.7 && Math.sin(t * 28 + i) > 0;
          px(x - 0.5, GROUND - 1, blink ? BLIGHT.markHot : BLIGHT.mark, 0.85);
          fleck(x + dir, GROUND - 0.5, BLIGHT.mark, 0.6);
        }
        glow(x0 + dir * span * warn * 0.5, GROUND, 10, BLIGHT.mark, 0.15 * warn);
      }
    },
    draw() {
      const r = reach();
      if (r <= 1) return;
      place();
      const front = x0 + dir * r;
      const wave = Math.sin(t * 30) * 1.2;
      drawVine({ x0, y0: GROUND - 4, x1: front, y1: GROUND - 3 + wave * 0.3, bend: wave, r0: 2.6, r1: 1.4 }, 1, 0.6);
      px(front - 0.5, GROUND - 4.5, BLIGHT.bone[3]);
      glow(front, GROUND - 3, 9, BLIGHT.spore[2], 0.4);
    },
  };
}
