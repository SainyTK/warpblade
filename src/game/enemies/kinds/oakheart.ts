import { GROUND } from "../../../constants/stage";
import { DAY_COLORS } from "../day/colors";
import { drawOakheart } from "../day/drawOakheart";
import { updateOakheart } from "../day/oakheart";
import type { EnemyKind } from "./kind";

/** Oakheart, the day's mini boss: an old oak that sweeps a branch up close, breaks the floor with roots, and lobs acorns */
export const oakheart: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 11, e.y - 38, e.x + 11, e.y],
  center: (e) => [e.x, e.y - 18],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 26, y: () => GROUND, riftY: () => GROUND - 22 },
  update: updateOakheart,
  draw: drawOakheart,
  glow: { radius: 36, color: DAY_COLORS.crack, eyeY: -5 },
  guardFrom: 1,
};
