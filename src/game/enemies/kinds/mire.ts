import { GROUND } from "../../../constants/stage";
import { rng } from "../../state";
import { RAIN_FOES } from "../rain/colors";
import { drawMire } from "../rain/drawMire";
import { updateMire } from "../rain/mire";
import type { EnemyKind } from "./kind";

/** the Mire Toad of the rain: hops at Kael, lashes its tongue up close and spits mud from afar */
export const mire: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 10, e.y - 14, e.x + 10, e.y],
  center: (e) => [e.x, e.y - 7],
  rest: "walk",
  firstCooldown: () => rng.range(0.9, 1.4),
  rift: { height: 12, y: () => GROUND, riftY: () => GROUND - 10 },
  update: updateMire,
  draw: drawMire,
  glow: { radius: 18, color: RAIN_FOES.wart, eyeY: -4 },
  staggers: true,
  orbs: 2,
  heartChance: 0.2,
};
