import { GUARD } from "../../../../constants/combat";
import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FOE } from "../colors";
import { updateRimehound } from "./behavior";
import { drawRimehound } from "./draw";

export const rimehound: EnemyKind = {
  flies: false,
  box: (e) => (e.face > 0 ? [e.x - 11, e.y - 17, e.x + 13, e.y] : [e.x - 13, e.y - 17, e.x + 11, e.y]),
  center: (e) => [e.x + e.face * 2, e.y - 10],
  rest: "walk",
  firstCooldown: () => 1,
  rift: { height: 13, y: () => GROUND, riftY: () => GROUND - 11 },
  update: updateRimehound,
  draw: drawRimehound,
  glow: { radius: 18, color: FOE.crystal[2], eyeY: -5 },
  guardFrom: GUARD.fromWave,
  orbs: 2,
  heartChance: 0.18,
};
