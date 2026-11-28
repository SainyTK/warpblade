import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { FORGE } from "../../colors";
import { drawCrucibledrone } from "./draw";
import { updateCrucibledrone } from "./moves";

export const crucibledroneKind: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 9, e.y - 13, e.x + 9, e.y + 8],
  center: (e) => [e.x, e.y - 3],
  rest: "drift",
  firstCooldown: () => rng.range(1.5, 2.5),
  rift: { height: 16, y: () => rng.range(50, 84), riftY: (y) => y },
  update: updateCrucibledrone,
  draw: drawCrucibledrone,
  glow: { radius: 18, color: FORGE.molten[2], eyeY: -6 },
  orbs: 2,
  heartChance: 0.12,
};
