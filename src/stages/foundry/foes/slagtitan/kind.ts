import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FORGE } from "../../colors";
import { drawSlagtitan } from "./draw";
import { mawOpen, updateSlagtitan } from "./moves";

const PLATED = 0.75;
const EXPOSED = 1.4;

export const slagtitanKind: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 15, e.y - 48, e.x + 15, e.y],
  center: (e) => [e.x, e.y - 26],
  rest: "walk",
  firstCooldown: () => 1.8,
  rift: { height: 28, y: () => GROUND, riftY: () => GROUND - 26 },
  update: updateSlagtitan,
  draw: drawSlagtitan,
  glow: { radius: 30, color: FORGE.molten[2], eyeY: -24 },
  glowRadius: (e) => (mawOpen(e) ? 38 : 30),
  takes: (e, dmg) => dmg * (mawOpen(e) ? EXPOSED : PLATED),
  steady: (e) => e.state === "wind" || e.state === "summon",
  orbs: 4,
  heartChance: 0.25,
};
