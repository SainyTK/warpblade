import { VOID } from "../abyss/colors";
import { drawUnblinking } from "../abyss/drawUnblinking";
import { updateUnblinking } from "../abyss/unblinking";
import type { EnemyKind } from "./kind";

/** The Unblinking, what comes after the last wave's boss: a great eye that nothing can hurt while it is open */
export const unblinking: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 22, e.y - 16, e.x + 22, e.y + 16],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => 1.6,
  rift: { height: 40, y: () => 56, riftY: (y) => y },
  update: updateUnblinking,
  draw: drawUnblinking,
  glow: { radius: 40, color: VOID[2], eyeY: 0 },
  warded: (e) => e.state !== "blink",
};
