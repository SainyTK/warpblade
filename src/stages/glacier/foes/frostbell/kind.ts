import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { updateFrostbell } from "./behavior";
import { BELL_COLORS } from "./colors";
import { drawFrostbell } from "./draw";

export const frostbell: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 11, e.y - 16, e.x + 11, e.y + 11],
  center: (e) => [e.x, e.y - 2],
  rest: "drift",
  firstCooldown: () => rng.range(1.2, 2),
  rift: { height: 20, y: () => rng.range(40, 80), riftY: (y) => y },
  update: updateFrostbell,
  draw: drawFrostbell,
  glow: { radius: 26, color: BELL_COLORS.rune[1], eyeY: -3 },
  glowRadius: (e) => (e.state === "wind" || e.state === "volley" ? 34 : 24),
  orbs: 3,
  heartChance: 0.15,
};
