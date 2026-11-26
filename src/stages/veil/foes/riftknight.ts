import { GROUND } from "../../../constants/stage";
import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { drawRiftknight } from "./drawRiftknight";
import { KNIGHT_COLORS } from "./knightColors";
import { flickering, updateRiftknight } from "./knightMoves";

export const riftknight: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 9, e.y - 30, e.x + 9, e.y],
  center: (e) => [e.x, e.y - 15],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 18, y: () => GROUND, riftY: () => GROUND - 16 },
  update: updateRiftknight,
  artVariant: (e) => (flickering(e) ? "blink" : null),
  draw: drawRiftknight,
  glow: { radius: 20, color: KNIGHT_COLORS.crystal, eyeY: -12 },
  guardFrom: 1,
  guarding: (e) => e.state === "walk",
  orbs: 2,
  heartChance: 0.2,
};
