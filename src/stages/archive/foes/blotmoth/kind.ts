import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { FOE } from "../colors";
import { wardedTakes } from "../lampWard";
import { updateBlotmoth } from "./behavior";
import { drawBlotmoth } from "./draw";

export const blotmoth: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 6, e.y - 5, e.x + 6, e.y + 4],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.8, 1.6),
  rift: { height: 9, y: () => rng.range(92, 118), riftY: (y) => y },
  update: updateBlotmoth,
  draw: drawBlotmoth,
  glow: { radius: 10, color: FOE.inkSheen, eyeY: 0 },
  takes: wardedTakes,
  orbs: 1,
};
