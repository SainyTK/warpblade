import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FOE } from "../colors";
import { rimeclawSteady, updateRimeclaw } from "./behavior";
import { drawRimeclaw } from "./draw";

export const rimeclaw: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 26, e.y - 36, e.x + 26, e.y],
  center: (e) => [e.x + e.face * 4, e.y - 22],
  rest: "walk",
  firstCooldown: () => 1.4,
  rift: { height: 30, y: () => GROUND, riftY: () => GROUND - 26 },
  update: updateRimeclaw,
  draw: drawRimeclaw,
  glow: { radius: 40, color: FOE.crystal[2], eyeY: -10 },
  glowRadius: (e) => (e.phase === 2 ? 52 : 40),
  steady: rimeclawSteady,
  takes: (e, dmg) => (e.state === "summon" ? dmg * 0.4 : dmg),
};
