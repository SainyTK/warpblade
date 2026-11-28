import { GROUND } from "../../../../constants/stage";
import { VOID } from "../../../../game/enemies/abyss/colors";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { shroudTakes } from "../shroud";
import { updateUmbramite } from "./behavior";
import { drawUmbramite } from "./draw";

export const umbramite: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 6, e.y - 10, e.x + 7, e.y],
  center: (e) => [e.x + e.face, e.y - 5],
  rest: "walk",
  firstCooldown: () => 0.9,
  rift: { height: 9, y: () => GROUND, riftY: () => GROUND - 6 },
  update: updateUmbramite,
  draw: drawUmbramite,
  glow: { radius: 11, color: VOID[3], eyeY: -5 },
  takes: shroudTakes,
};
