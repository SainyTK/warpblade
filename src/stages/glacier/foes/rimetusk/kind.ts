import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { updateRimetusk } from "./behavior";
import { TUSK_COLORS } from "./colors";
import { TUSK_TAKES } from "./constants";
import { drawRimetusk } from "./draw";
import { isDazed } from "./recovery";

export const rimetusk: EnemyKind = {
  flies: false,
  box: (e) => (e.face > 0 ? [e.x - 21, e.y - 30, e.x + 26, e.y] : [e.x - 26, e.y - 30, e.x + 21, e.y]),
  center: (e) => [e.x + e.face * 3, e.y - 17],
  rest: "walk",
  firstCooldown: () => 1.4,
  rift: { height: 24, y: () => GROUND, riftY: () => GROUND - 18 },
  update: updateRimetusk,
  draw: drawRimetusk,
  glow: { radius: 26, color: TUSK_COLORS.tusk[1], eyeY: -14 },
  steady: (e) => e.state === "charge",
  takes(e, dmg) {
    if (e.state === "charge") return dmg * TUSK_TAKES.charging;
    return isDazed(e) ? dmg * TUSK_TAKES.dazed : dmg;
  },
  orbs: 3,
  heartChance: 0.14,
};
