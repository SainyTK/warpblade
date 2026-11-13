import { VOID } from "../abyss/colors";
import { drawUnblinking } from "../abyss/drawUnblinking";
import { UNBLINKING_SHUT_SHARE, updateUnblinking } from "../abyss/unblinking";
import type { EnemyKind } from "./kind";

/**
 * The Unblinking, what comes after the last wave's boss: a great eye with HP far past anything a run can deal. Every hit
 * lands, and none of them seems to matter. Shut, each of the hero's own blows takes a share of all it has (gaze.ts).
 */
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
  takes: (e, dmg, loud) => (e.state === "blink" && loud ? Math.max(dmg, e.max * UNBLINKING_SHUT_SHARE) : dmg),
};
