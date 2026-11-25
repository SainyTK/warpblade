import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FOE } from "../colors";
import { updateCryomancer } from "./behavior";
import { drawCryomancer } from "./draw";
import { breakWard, wardLeft } from "./ward";

export const cryomancer: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 8, e.y - 32, e.x + 8, e.y],
  center: (e) => [e.x, e.y - 17],
  rest: "walk",
  firstCooldown: () => 1.1,
  rift: { height: 20, y: () => GROUND, riftY: () => GROUND - 17 },
  update: updateCryomancer,
  draw: drawCryomancer,
  glow: { radius: 18, color: FOE.robe[3], eyeY: -10 },
  guardFrom: 1,
  guarding: (e) => wardLeft(e) > 0,
  takes(e, dmg, loud) {
    if (loud && wardLeft(e) > 0) breakWard(e);
    return dmg;
  },
  orbs: 2,
  heartChance: 0.15,
};
