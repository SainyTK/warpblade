import { GROUND } from "../../../constants/stage";
import { updateBoghulk } from "../rain/boghulk";
import { RAIN_FOES } from "../rain/colors";
import { drawBoghulk } from "../rain/drawBoghulk";
import type { EnemyKind } from "./kind";

/** the Bog Hulk, mini boss of the rain: slams the floor up close, rolls mud waves at mid range and lobs globs from afar */
export const boghulk: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 15, e.y - 34, e.x + 15, e.y],
  center: (e) => [e.x, e.y - 17],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 24, y: () => GROUND, riftY: () => GROUND - 20 },
  update: updateBoghulk,
  draw: drawBoghulk,
  glow: { radius: 40, color: RAIN_FOES.wart, eyeY: -5 },
  guardFrom: 1,
};
