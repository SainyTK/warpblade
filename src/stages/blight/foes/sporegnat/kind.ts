import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { updateSporegnat } from "./behavior";
import { GNAT } from "./colors";
import { drawSporegnat } from "./draw";

export const sporegnat: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 5, e.y - 5, e.x + 5, e.y + 4],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.9, 1.6),
  rift: { height: 9, y: () => rng.range(70, 110), riftY: (y) => y },
  update: updateSporegnat,
  draw: drawSporegnat,
  glow: { radius: 10, color: GNAT.sac[2], eyeY: -1 },
  orbs: 1,
  heartChance: 0.05,
};
