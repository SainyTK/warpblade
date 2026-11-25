import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { BLIGHT } from "../../colors";
import { drawSporeheart } from "./drawSporeheart";
import { CORE, heartTakes, steadyHeart } from "./moves";
import { updateSporeheart } from "./sporeheart";

export const sporeheart: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 17, e.y - 52, e.x + 17, e.y],
  center: (e) => [e.x + e.face * CORE.x, e.y + CORE.y],
  rest: "walk",
  firstCooldown: () => 1.6,
  rift: { height: 30, y: () => GROUND, riftY: () => GROUND - 26 },
  update: updateSporeheart,
  draw: drawSporeheart,
  glow: { radius: 38, color: BLIGHT.spore[2], eyeY: -4 },
  glowRadius: (e) => (e.phase === 2 ? 52 : 38),
  takes: heartTakes,
  steady: steadyHeart,
  orbs: 10,
};
