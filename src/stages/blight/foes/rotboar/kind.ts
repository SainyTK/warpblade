import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { updateRotboar } from "./behavior";
import { BOAR } from "./colors";
import { drawRotboar } from "./draw";

export const rotboar: EnemyKind = {
  flies: false,
  box: (e) => (e.face > 0 ? [e.x - 12, e.y - 19, e.x + 15, e.y] : [e.x - 15, e.y - 19, e.x + 12, e.y]),
  center: (e) => [e.x + e.face * 2, e.y - 10],
  rest: "walk",
  firstCooldown: () => rng.range(1, 1.6),
  rift: { height: 15, y: () => GROUND, riftY: () => GROUND - 12 },
  update: updateRotboar,
  draw: drawRotboar,
  glow: { radius: 20, color: BOAR.pustule[2], eyeY: -9 },
  guardFrom: 1,
  guarding: (e) => e.state === "walk",
  orbs: 2,
  heartChance: 0.18,
};
