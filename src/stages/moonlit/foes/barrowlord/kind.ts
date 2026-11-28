import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { GRAVE } from "../graveColors";
import { drawBarrowlord } from "./draw";
import { updateBarrowlord } from "./moves";
import { exposed, LORD } from "./pose";

export const barrowlord: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 9, e.y - 38, e.x + 10, e.y],
  center: (e) => [e.x, e.y - 20],
  rest: "walk",
  firstCooldown: () => 1.4,
  rift: { height: 24, y: () => GROUND, riftY: () => GROUND - 20 },
  update: updateBarrowlord,
  draw: drawBarrowlord,
  glow: { radius: 22, color: GRAVE.fire[1], eyeY: -34 },
  takes: (e, dmg) => dmg * (exposed(e) ? LORD.opened : LORD.armour),
  steady: (e) => e.state === "charge" || e.state === "swipe",
  orbs: 3,
  heartChance: 0.25,
};
