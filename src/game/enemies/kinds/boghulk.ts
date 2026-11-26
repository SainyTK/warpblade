import { GROUND } from "../../../constants/stage";
import { updateBoghulk } from "../rain/boghulk";
import { RAIN_FOES } from "../rain/colors";
import { drawBoghulk } from "../rain/drawBoghulk";
import { cracked, HULK_GLOW, hulkTakes, lying, RUSH, steadyHulk } from "../rain/hulkMoves";
import type { EnemyKind } from "./kind";

export const boghulk: EnemyKind = {
  flies: false,
  box: (e) =>
    lying(e)
      ? [e.x - RUSH.slideHalfWidth, e.y - RUSH.slideHeight, e.x + RUSH.slideHalfWidth, e.y]
      : [e.x - 15, e.y - 34, e.x + 15, e.y],
  center: (e) => (lying(e) ? [e.x, e.y - RUSH.slideHeight / 2] : [e.x, e.y - 17]),
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 24, y: () => GROUND, riftY: () => GROUND - 20 },
  update: updateBoghulk,
  draw: drawBoghulk,
  artVariant: (e) => (e.state === "recover" && lying(e) && e.stagger <= 0 && e.stun <= 0 && !e.air ? "rush" : null),
  glow: { radius: HULK_GLOW.calm, color: RAIN_FOES.wart, eyeY: -5 },
  glowRadius: (e) => (cracked(e) ? HULK_GLOW.enraged : HULK_GLOW.calm),
  guardFrom: 1,
  guarding: (e) => !steadyHulk(e),
  takes: hulkTakes,
  steady: steadyHulk,
};
