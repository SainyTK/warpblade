import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { grounded, takeOnHide } from "./armour";
import { GARGOYLE_COLORS } from "./colors";
import { drawGargoyle } from "./draw";
import { updateGargoyle } from "./moves";

export const ivygargoyle: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 10, e.y - 12, e.x + 12, e.y + 11],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1.2, 2),
  rift: { height: 16, y: () => rng.range(40, 80), riftY: (y) => y },
  update: updateGargoyle,
  draw: drawGargoyle,
  glow: { radius: 20, color: GARGOYLE_COLORS.crack, eyeY: -8 },
  glowRadius: (e) => (grounded(e) ? 28 : 20),
  takes: takeOnHide,
  orbs: 3,
  heartChance: 0.2,
};
