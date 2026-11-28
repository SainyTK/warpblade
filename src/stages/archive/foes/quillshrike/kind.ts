import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { Box } from "../../../../types/world";
import { FOE } from "../colors";
import { wardedTakes } from "../lampWard";
import { updateQuillshrike } from "./behavior";
import { drawQuillshrike } from "./draw";

const STUCK_SHARE = 1.5;

function box(e: Enemy): Box {
  if (e.state === "recover" || e.state === "leap") return [e.x - 6, e.y - 14, e.x + 6, e.y + 12];
  return [e.x - 10, e.y - 6, e.x + 10, e.y + 6];
}

export const quillshrike: EnemyKind = {
  flies: true,
  box,
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1, 1.8),
  rift: { height: 14, y: () => rng.range(70, 100), riftY: (y) => y },
  update: updateQuillshrike,
  draw: drawQuillshrike,
  glow: { radius: 16, color: FOE.letter, eyeY: 0 },
  takes: (e, dmg, loud) => wardedTakes(e, e.state === "recover" ? dmg * STUCK_SHARE : dmg, loud),
  orbs: 2,
  heartChance: 0.1,
};
