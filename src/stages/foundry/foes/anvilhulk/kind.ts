import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FORGE } from "../../colors";
import { drawAnvilhulk } from "./draw";
import { updateAnvilhulk, venting } from "./moves";

const VENT_DAMAGE = 1.5;

export const anvilhulkKind: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 12, e.y - 36, e.x + 12, e.y],
  center: (e) => [e.x, e.y - 18],
  rest: "walk",
  firstCooldown: () => 1.6,
  rift: { height: 22, y: () => GROUND, riftY: () => GROUND - 20 },
  update: updateAnvilhulk,
  draw: drawAnvilhulk,
  glow: { radius: 24, color: FORGE.molten[2], eyeY: -18 },
  guardFrom: 1,
  guarding: (e) => e.state === "walk",
  takes: (e, dmg) => (venting(e) ? dmg * VENT_DAMAGE : dmg),
  orbs: 3,
  heartChance: 0.18,
};
