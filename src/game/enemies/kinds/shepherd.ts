import { PAL } from "../../../constants/palette";
import { GROUND } from "../../../constants/stage";
import { drawShepherd } from "../night/drawShepherd";
import { updateShepherd } from "../night/shepherd";
import { KNEEL } from "../night/shepherdMoves";
import type { EnemyKind } from "./kind";

export const shepherd: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 12, e.y - 50, e.x + 12, e.y],
  center: (e) => [e.x, e.y - 26],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 30, y: () => GROUND, riftY: () => GROUND - 26 },
  update: updateShepherd,
  draw: drawShepherd,
  glow: { radius: 42, color: PAL.shadow[3], eyeY: -19 },
  guardFrom: 1,
  takes: (e, dmg) => (e.state === "burrow" ? dmg * KNEEL.taken : dmg),
};
