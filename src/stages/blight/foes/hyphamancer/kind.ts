import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { BLIGHT } from "../../colors";
import { updateHyphamancer } from "./behavior";
import { drawHyphamancer } from "./draw";

export const hyphamancer: EnemyKind = {
  flies: false,
  box: (e) => (e.face > 0 ? [e.x - 8, e.y - 38, e.x + 11, e.y] : [e.x - 11, e.y - 38, e.x + 8, e.y]),
  center: (e) => [e.x + e.face * 2, e.y - 20],
  rest: "walk",
  firstCooldown: () => rng.range(0.9, 1.5),
  rift: { height: 22, y: () => GROUND, riftY: () => GROUND - 19 },
  update: updateHyphamancer,
  draw: drawHyphamancer,
  glow: { radius: 22, color: BLIGHT.fungus[2], eyeY: -10 },
  orbs: 2,
  heartChance: 0.15,
};
