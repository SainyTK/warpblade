import { GROUND } from "../../../constants/stage";
import { VOID } from "../abyss/colors";
import { drawMaw } from "../abyss/drawMaw";
import { updateMaw } from "../abyss/maw";
import type { EnemyKind } from "./kind";

/** the Abyss Maw, mini boss of the abyss: bites up close, lobs void globs and slams rows of spikes along the floor */
export const maw: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 16, e.y - 34, e.x + 16, e.y],
  center: (e) => [e.x, e.y - 17],
  rest: "walk",
  firstCooldown: () => 1,
  rift: { height: 26, y: () => GROUND, riftY: () => GROUND - 20 },
  update: updateMaw,
  draw: drawMaw,
  glow: { radius: 34, color: VOID[3], eyeY: -9 },
  guardFrom: 1,
};
