import { GROUND } from "../../../constants/stage";
import { VOID } from "../abyss/colors";
import { drawSovereign } from "../abyss/drawSovereign";
import { updateSovereign } from "../abyss/sovereign";
import type { EnemyKind } from "./kind";

/** the Abyss Sovereign, boss of the last wave: cleaves up close, steps through a rift behind the hero and calls down pillars of void light */
export const sovereign: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 13, e.y - 54, e.x + 13, e.y],
  center: (e) => [e.x, e.y - 28],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 34, y: () => GROUND, riftY: () => GROUND - 28 },
  update: updateSovereign,
  draw: drawSovereign,
  glow: { radius: 32, color: VOID[2], eyeY: -15 },
};
