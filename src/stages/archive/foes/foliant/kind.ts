import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FOE } from "../colors";
import { wardedTakes } from "../lampWard";
import { unbound, updateFoliant } from "./behavior";
import { drawFoliant } from "./draw";
import { FOLIANT } from "./moves";

export const foliant: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 11, e.y - 44, e.x + 11, e.y],
  center: (e) => [e.x, e.y - 24],
  rest: "walk",
  firstCooldown: () => 1.5,
  rift: { height: 28, y: () => GROUND, riftY: () => GROUND - 24 },
  update: updateFoliant,
  draw: drawFoliant,
  glow: { radius: 24, color: FOE.glyph[2], eyeY: -42 },
  takes: (e, dmg, loud) => wardedTakes(e, dmg * (unbound(e) ? FOLIANT.open : FOLIANT.bound), loud),
  orbs: 3,
  heartChance: 0.18,
};
