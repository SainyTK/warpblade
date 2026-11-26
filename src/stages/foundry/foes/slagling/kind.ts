import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FORGE } from "../../colors";
import { updateSlagling } from "./behavior";
import { slagTakes } from "./death";
import { drawSlagling } from "./draw";
import { isSmall, slagScale } from "./size";

export const slaglingKind: EnemyKind = {
  flies: false,
  box: (e) => {
    const k = slagScale(e);
    const top = e.y - e.ay;
    return [e.x - 8 * k, top - 12 * k, e.x + 8 * k, top];
  },
  center: (e) => [e.x, e.y - e.ay - 6 * slagScale(e)],
  rest: "walk",
  artVariant: (e) => (isSmall(e) ? "small" : null),
  firstCooldown: () => 1.1,
  rift: { height: 12, y: () => GROUND, riftY: () => GROUND - 10 },
  update: updateSlagling,
  draw: drawSlagling,
  glow: { radius: 18, color: FORGE.molten[2], eyeY: -1 },
  glowRadius: (e) => 18 * slagScale(e),
  takes: slagTakes,
  orbs: 1,
  heartChance: 0.12,
};
