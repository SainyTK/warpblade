import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { BLIGHT } from "../../colors";
import { drawSpitbloom } from "./drawSpitbloom";
import { updateSpitbloom } from "./spitbloom";

export const spitbloom: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 8, e.y - 27, e.x + 9, e.y],
  center: (e) => [e.x + e.face * 2, e.y - 16],
  rest: "walk",
  firstCooldown: () => rng.range(0.8, 1.6),
  rift: { height: 16, y: () => GROUND, riftY: () => GROUND - 14 },
  update: updateSpitbloom,
  draw: drawSpitbloom,
  glow: { radius: 18, color: BLIGHT.petal[3], eyeY: -6 },
  orbs: 2,
  heartChance: 0.2,
};
