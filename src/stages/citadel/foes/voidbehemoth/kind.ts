import { GROUND } from "../../../../constants/stage";
import { VOID } from "../../../../game/enemies/abyss/colors";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { shroudTakes } from "../shroud";
import { behemothExposed, behemothTakes, updateVoidbehemoth } from "./behavior";
import { drawVoidbehemoth } from "./draw";

export const voidbehemoth: EnemyKind = {
  flies: false,
  box: (e) => (e.face > 0 ? [e.x - 28, e.y - 40, e.x + 34, e.y] : [e.x - 34, e.y - 40, e.x + 28, e.y]),
  center: (e) => [e.x, e.y - 22],
  rest: "walk",
  firstCooldown: () => 1.5,
  rift: { height: 30, y: () => GROUND, riftY: () => GROUND - 24 },
  update: updateVoidbehemoth,
  draw: drawVoidbehemoth,
  glow: { radius: 34, color: VOID[3], eyeY: -18 },
  glowRadius: (e) => (behemothExposed(e) ? 44 : 34),
  takes: (e, dmg) => shroudTakes(e, behemothTakes(e, dmg)),
  orbs: 4,
  heartChance: 0.3,
};
