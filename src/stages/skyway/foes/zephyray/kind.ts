import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { stormWardTakes } from "../stormWard";
import { RAY } from "./colors";
import { drawZephyray } from "./draw";
import { updateZephyray } from "./moves";

export const zephyray: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 11, e.y - 8, e.x + 11, e.y + 8],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1.4, 2.2),
  rift: { height: 16, y: () => rng.range(40, 90), riftY: (y) => y },
  update: updateZephyray,
  draw: drawZephyray,
  glow: { radius: 20, color: RAY.gill[2], eyeY: -1 },
  glowRadius: (e) => (e.state === "wind" ? 26 : 20),
  evades: true,
  takes: (e, dmg) => stormWardTakes(e, dmg),
};
