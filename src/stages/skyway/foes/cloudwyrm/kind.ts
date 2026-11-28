import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { stormWardTakes } from "../stormWard";
import { WYRM } from "./colors";
import { ARMOUR } from "./constants";
import { drawCloudwyrm } from "./draw";
import { updateCloudwyrm } from "./moves";

export const cloudwyrm: EnemyKind = {
  flies: true,
  box: (e) => (e.face > 0 ? [e.x - 26, e.y - 7, e.x + 11, e.y + 7] : [e.x - 11, e.y - 7, e.x + 26, e.y + 7]),
  center: (e) => [e.x - e.face * 6, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1.6, 2.4),
  rift: { height: 16, y: () => rng.range(40, 90), riftY: (y) => y },
  update: updateCloudwyrm,
  draw: drawCloudwyrm,
  glow: { radius: 22, color: WYRM.volt[2], eyeY: -2 },
  glowRadius: (e) => (e.state === "wind" || e.state === "beam" ? 30 : e.state === "recover" ? 12 : 22),
  takes: (e, dmg) => stormWardTakes(e, dmg * (e.state === "recover" ? ARMOUR.open : ARMOUR.hard)),
};
