import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { stormWardTakes } from "../stormWard";
import { COLOSSUS } from "./colors";
import { OPEN_CORE } from "./constants";
import { drawStormcolossus } from "./draw";
import { updateStormcolossus } from "./moves";

const steadyNow = (state: string): boolean => state === "wind" || state === "swipe";

export const stormcolossus: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 12, e.y - 44, e.x + 13, e.y],
  center: (e) => [e.x, e.y - 24],
  rest: "walk",
  firstCooldown: () => 1.4,
  rift: { height: 26, y: () => GROUND, riftY: () => GROUND - 22 },
  update: updateStormcolossus,
  draw: drawStormcolossus,
  glow: { radius: 28, color: COLOSSUS.core[2], eyeY: -28 },
  glowRadius: (e) => (e.state === "wind" ? 36 : 28),
  guardFrom: 1,
  steady: (e) => steadyNow(e.state),
  takes: (e, dmg) => stormWardTakes(e, e.state === "recover" ? dmg * OPEN_CORE : dmg),
  orbs: 3,
  heartChance: 0.25,
};
