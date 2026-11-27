import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FOE } from "../colors";
import { wardedTakes } from "../lampWard";
import { scrivenerHidden, updateScrivener } from "./behavior";
import { drawScrivener } from "./draw";

export const scrivener: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 7, e.y - 32, e.x + 8, e.y],
  center: (e) => [e.x, e.y - 17],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 22, y: () => GROUND, riftY: () => GROUND - 18 },
  update: updateScrivener,
  draw: drawScrivener,
  glow: { radius: 18, color: FOE.letter, eyeY: -29 },
  takes: (e, dmg, loud) => (scrivenerHidden(e) ? 0 : wardedTakes(e, dmg, loud)),
  orbs: 2,
  heartChance: 0.12,
};
