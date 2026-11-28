import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { BASILISK_COLORS } from "./colors";
import { drawBasilisk } from "./draw";
import { prowling, updateBasilisk } from "./moves";

export const sunbasilisk: EnemyKind = {
  flies: false,
  box: (e) => [
    Math.min(e.x - e.face * 24, e.x + e.face * 34),
    e.y - 22,
    Math.max(e.x - e.face * 24, e.x + e.face * 34),
    e.y,
  ],
  center: (e) => [e.x + e.face * 4, e.y - 12],
  rest: "walk",
  firstCooldown: () => 1.6,
  rift: { height: 18, y: () => GROUND, riftY: () => GROUND - 14 },
  update: updateBasilisk,
  draw: drawBasilisk,
  glow: { radius: 30, color: BASILISK_COLORS.sun[1], eyeY: -16 },
  guardFrom: 1,
  guarding: prowling,
  orbs: 4,
  heartChance: 0.3,
};
