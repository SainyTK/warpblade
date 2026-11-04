import { rng } from "../../state";
import { DAY_COLORS } from "../day/colors";
import { drawMoth } from "../day/drawMoth";
import { updateMoth } from "../day/moth";
import type { EnemyKind } from "./kind";

/** the Glimmer Moth of the day: it flutters high over Kael and sheds puffs of stinging pollen that sway down to the floor */
export const moth: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 8, e.y - 7, e.x + 8, e.y + 6],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.8, 1.8),
  rift: { height: 12, y: () => rng.range(40, 100), riftY: (y) => y },
  update: updateMoth,
  draw: drawMoth,
  glow: { radius: 16, color: DAY_COLORS.wing[3], eyeY: -1 },
  evades: true,
};
