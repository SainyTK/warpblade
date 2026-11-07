import { HERO_MOVE } from "../../../constants/combat";
import { FLIGHT } from "../../../constants/orrin/hook";
import { approach } from "../../../utils/math";
import { hero, progress } from "../../state";

/**
 * The flight after he lets go or bounces off a foe: his speed is kept, and Left or Right steer him. Pushing along a
 * fast flight adds nothing; pushing against it or flying slow steers as a walk would. With no side held he eases off.
 */
export function runFly(dt: number, dir: number): void {
  const h = hero;
  const walk = HERO_MOVE.walkSpeed * progress.stats.move;
  if (dir) {
    if (Math.sign(h.vx) !== dir || Math.abs(h.vx) < walk) h.vx = approach(h.vx, dir * walk, FLIGHT.accel * dt);
    h.face = dir;
  } else h.vx -= h.vx * FLIGHT.drag * dt;
}
