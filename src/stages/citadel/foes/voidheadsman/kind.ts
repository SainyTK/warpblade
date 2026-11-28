import { GROUND } from "../../../../constants/stage";
import { VOID } from "../../../../game/enemies/abyss/colors";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { headsmanTakes, updateVoidheadsman } from "./behavior";
import { drawVoidheadsman } from "./draw";

const sunk = (e: { state: string }): boolean => e.state === "blink";

export const voidheadsman: EnemyKind = {
  flies: false,
  box: (e) => (sunk(e) ? [e.x - 10, e.y - 20, e.x + 10, e.y] : [e.x - 12, e.y - 58, e.x + 14, e.y]),
  center: (e) => [e.x, e.y - 32],
  rest: "walk",
  firstCooldown: () => 1.4,
  rift: { height: 36, y: () => GROUND, riftY: () => GROUND - 30 },
  update: updateVoidheadsman,
  draw: drawVoidheadsman,
  glow: { radius: 40, color: VOID[3], eyeY: -50 },
  takes: headsmanTakes,
  orbs: 5,
  heartChance: 0.35,
};
