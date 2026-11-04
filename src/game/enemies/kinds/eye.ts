import { rng } from "../../state";
import { VOID } from "../abyss/colors";
import { drawEye } from "../abyss/drawEye";
import { updateEye } from "../abyss/eye";
import type { EnemyKind } from "./kind";

/** the Abyss Eye: a floating eye that stares Kael down along a sight line, locks it, and burns a beam down it */
export const eye: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 7, e.y - 7, e.x + 7, e.y + 7],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.8, 1.8),
  rift: { height: 11, y: () => rng.range(36, 90), riftY: (y) => y },
  update: updateEye,
  draw: drawEye,
  glow: { radius: 16, color: VOID[3], eyeY: 0 },
  evades: true,
};
