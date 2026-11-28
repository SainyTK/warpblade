import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { VEIL } from "../colors";
import { updateShardram } from "./behavior";
import { drawShardram } from "./draw";

export const shardram: EnemyKind = {
  flies: false,
  box: (e) => (e.face > 0 ? [e.x - 12, e.y - 20, e.x + 15, e.y] : [e.x - 15, e.y - 20, e.x + 12, e.y]),
  center: (e) => [e.x + e.face * 2, e.y - 11],
  rest: "walk",
  firstCooldown: () => 1.1,
  rift: { height: 15, y: () => GROUND, riftY: () => GROUND - 12 },
  update: updateShardram,
  draw: drawShardram,
  glow: { radius: 20, color: VEIL.crystal[2], eyeY: -13 },
  guardFrom: 1,
  guarding: (e) => e.state === "walk",
  orbs: 2,
  heartChance: 0.15,
};
