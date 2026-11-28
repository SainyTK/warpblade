import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { updateFrostcolossus } from "./behavior";
import { COLOSSUS_COLORS } from "./colors";
import { COLOSSUS_TAKES } from "./constants";
import { drawFrostcolossus } from "./draw";
import { isExposed } from "./recovery";

export const frostcolossus: EnemyKind = {
  flies: false,
  box: (e) => (e.face > 0 ? [e.x - 17, e.y - 50, e.x + 27, e.y] : [e.x - 27, e.y - 50, e.x + 17, e.y]),
  center: (e) => [e.x, e.y - 28],
  rest: "walk",
  firstCooldown: () => 1.6,
  rift: { height: 34, y: () => GROUND, riftY: () => GROUND - 26 },
  update: updateFrostcolossus,
  draw: drawFrostcolossus,
  glow: { radius: 32, color: COLOSSUS_COLORS.core[2], eyeY: -46 },
  glowRadius: (e) => (isExposed(e) ? 40 : 30),
  steady: (e) => !isExposed(e),
  takes: (e, dmg) => dmg * (isExposed(e) ? COLOSSUS_TAKES.exposed : COLOSSUS_TAKES.armoured),
  orbs: 4,
  heartChance: 0.2,
};
