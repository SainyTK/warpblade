import { GROUND } from "../../../constants/stage";
import { VOID } from "../abyss/colors";
import { drawStalker } from "../abyss/drawStalker";
import { sunk, updateStalker } from "../abyss/stalker";
import type { EnemyKind } from "./kind";

/** the Void Stalker of the abyss: a lean hound that claws up close and glides under the floor to rise beneath Kael */
export const stalker: EnemyKind = {
  flies: false,
  box: (e) => (sunk(e) ? [e.x - 9, e.y - 5, e.x + 9, e.y] : [e.x - 9, e.y - 20, e.x + 9, e.y]),
  center: (e) => (sunk(e) ? [e.x, e.y - 3] : [e.x, e.y - 11]),
  rest: "walk",
  firstCooldown: () => 1,
  rift: { height: 16, y: () => GROUND, riftY: () => GROUND - 12 },
  update: updateStalker,
  draw: drawStalker,
  glow: { radius: 22, color: VOID[3], eyeY: -5 },
  staggers: true,
  orbs: 2,
  heartChance: 0.2,
};
