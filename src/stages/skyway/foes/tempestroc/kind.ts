import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { SKY_FOES } from "../colors";
import { drawTempestroc } from "./draw";
import { ROC_GLOW, ROC_HOVER, roaring, stormy } from "./moves";
import { updateTempestroc } from "./update";

export const tempestroc: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 18, e.y - 14, e.x + 20, e.y + 12],
  center: (e) => [e.x + 2, e.y - 1],
  rest: "drift",
  firstCooldown: () => 1.4,
  rift: { height: 30, y: () => ROC_HOVER.height, riftY: (y) => y },
  update: updateTempestroc,
  draw: drawTempestroc,
  glow: { radius: ROC_GLOW.calm, color: SKY_FOES.volt[2], eyeY: -7 },
  glowRadius: (e) => (stormy(e) ? ROC_GLOW.storm : ROC_GLOW.calm),
  steady: roaring,
};
