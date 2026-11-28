import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { stormWardTakes } from "../stormWard";
import { WARDEN } from "./colors";
import { drawLanternwarden } from "./draw";
import { updateLanternwarden } from "./moves";

export const lanternwarden: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 8, e.y - 46, e.x + 8, e.y],
  center: (e) => [e.x, e.y - 24],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 26, y: () => GROUND, riftY: () => GROUND - 24 },
  update: updateLanternwarden,
  draw: drawLanternwarden,
  glow: { radius: 22, color: WARDEN.light[2], eyeY: -42 },
  glowRadius: (e) => (e.state === "wind" || e.state === "summon" ? 32 : 22),
  guardFrom: 1,
  takes: (e, dmg) => stormWardTakes(e, dmg),
  orbs: 2,
  heartChance: 0.2,
};
