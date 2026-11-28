import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { stormWardTakes } from "../stormWard";
import { RAM } from "./colors";
import { drawGaleram } from "./draw";
import { updateGaleram } from "./moves";

export const galeram: EnemyKind = {
  flies: false,
  box: (e) => (e.face > 0 ? [e.x - 13, e.y - 21, e.x + 19, e.y] : [e.x - 19, e.y - 21, e.x + 13, e.y]),
  center: (e) => [e.x, e.y - 11],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 16, y: () => GROUND, riftY: () => GROUND - 12 },
  update: updateGaleram,
  draw: drawGaleram,
  glow: { radius: 18, color: RAM.volt[2], eyeY: -12 },
  guardFrom: 1,
  takes: (e, dmg) => stormWardTakes(e, dmg),
  orbs: 2,
  heartChance: 0.15,
};
