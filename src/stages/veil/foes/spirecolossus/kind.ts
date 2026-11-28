import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { VEIL } from "../colors";
import { updateSpirecolossus } from "./behavior";
import { COLOSSUS } from "./constants";
import { drawSpirecolossus } from "./draw";

export const spirecolossus: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 13, e.y - 42, e.x + 13, e.y],
  center: (e) => [e.x, e.y - 22],
  rest: "walk",
  firstCooldown: () => 1.4,
  rift: { height: 26, y: () => GROUND, riftY: () => GROUND - 22 },
  update: updateSpirecolossus,
  draw: drawSpirecolossus,
  glow: { radius: 30, color: VEIL.crystal[2], eyeY: -36 },
  takes: (e, dmg) => dmg * (e.state === "recover" ? COLOSSUS.exposed : COLOSSUS.guarded),
  orbs: 3,
  heartChance: 0.3,
};
