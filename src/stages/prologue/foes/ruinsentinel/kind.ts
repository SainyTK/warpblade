import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { SENTINEL_COLORS } from "./colors";
import { drawSentinel } from "./draw";
import { guardUp, updateSentinel } from "./moves";

export const ruinsentinel: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 10, e.y - 34, e.x + 12, e.y],
  center: (e) => [e.x, e.y - 18],
  rest: "walk",
  firstCooldown: () => 1.4,
  rift: { height: 21, y: () => GROUND, riftY: () => GROUND - 18 },
  update: updateSentinel,
  draw: drawSentinel,
  glow: { radius: 22, color: SENTINEL_COLORS.crack, eyeY: -14 },
  guardFrom: 1,
  guarding: guardUp,
  orbs: 3,
  heartChance: 0.25,
};
