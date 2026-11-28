import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { updateRotbear } from "./behavior";
import { BEAR } from "./colors";
import { drawRotbear } from "./draw";
import { bearTakes } from "./takes";

const rearing = (state: string): boolean => state === "wind";

export const rotbear: EnemyKind = {
  flies: false,
  box: (e) => {
    if (rearing(e.state)) return [e.x - 13, e.y - 44, e.x + 14, e.y];
    return e.face > 0 ? [e.x - 19, e.y - 29, e.x + 23, e.y] : [e.x - 23, e.y - 29, e.x + 19, e.y];
  },
  center: (e) => (rearing(e.state) ? [e.x, e.y - 26] : [e.x + e.face * 2, e.y - 16]),
  rest: "walk",
  firstCooldown: () => rng.range(1.2, 1.8),
  rift: { height: 24, y: () => GROUND, riftY: () => GROUND - 18 },
  update: updateRotbear,
  draw: drawRotbear,
  glow: { radius: 20, color: BEAR.sac[3], eyeY: -13 },
  guardFrom: 1,
  takes: bearTakes,
  steady: (e) => e.state === "wind" || e.state === "swipe",
  orbs: 3,
  heartChance: 0.25,
};
