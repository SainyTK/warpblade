import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { BLIGHT } from "../../colors";
import { drawSporepuff } from "./drawSporepuff";
import { puffTakes, updateSporepuff } from "./sporepuff";

export const sporepuff: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 7, e.y - 7, e.x + 7, e.y + 7],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1, 2),
  rift: { height: 12, y: () => rng.range(60, 110), riftY: (y) => y },
  update: updateSporepuff,
  draw: drawSporepuff,
  glow: { radius: 16, color: BLIGHT.spore[2], eyeY: 0 },
  takes: puffTakes,
};
