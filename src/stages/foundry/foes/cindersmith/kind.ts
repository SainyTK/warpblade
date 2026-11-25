import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FORGE } from "../../colors";
import { updateCindersmith } from "./behavior";
import { drawCindersmith } from "./draw";

const GLOW = { calm: 40, cracked: 58 } as const;

export const cindersmithKind: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 16, e.y - 54, e.x + 17, e.y],
  center: (e) => [e.x + e.face * 2, e.y - 34],
  rest: "walk",
  firstCooldown: () => 1.6,
  rift: { height: 36, y: () => GROUND, riftY: () => GROUND - 30 },
  update: updateCindersmith,
  draw: drawCindersmith,
  glow: { radius: GLOW.calm, color: FORGE.molten[2], eyeY: -14 },
  glowRadius: (e) => (e.phase >= 2 ? GLOW.cracked : GLOW.calm),
  steady: () => true,
};
