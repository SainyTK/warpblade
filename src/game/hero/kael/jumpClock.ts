import { STATE_CLIPS } from "../../../constants/clips";
import { JUMP_CATCH_UP } from "../../../constants/kael/motion";
import type { Hero } from "../../../types/hero";
import { clamp } from "../../../utils/math";
import { motion } from "./motion";

/**
 * The jump clip's clock follows the rise: it starts at the launch and reaches its last key, the top of the arc, when
 * the rise stops, however high the jump goes. A rise cut short lets it catch up, never jump.
 */
export function jumpClock(h: Hero, fresh: boolean, dt: number): number {
  const m = motion;
  if (fresh) {
    m.jumpT = 0;
    m.jumpV0 = Math.max(1, -h.vy);
  }
  const dur = STATE_CLIPS.jump.dur;
  const target = clamp(1 - Math.max(0, -h.vy) / m.jumpV0) * dur;
  m.jumpT = Math.max(m.jumpT, Math.min(target, m.jumpT + dt * JUMP_CATCH_UP));
  return m.jumpT;
}
