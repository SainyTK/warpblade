import { GUARD } from "../../../constants/combat";
import { PAL } from "../../../constants/palette";
import { GROUND } from "../../../constants/stage";
import { rng } from "../../state";
import { updateBrute } from "../brute";
import { drawHusk } from "../drawHusk";
import { drawWarden } from "../drawWarden";
import { drawWisp } from "../drawWisp";
import { updateHusk } from "../husk";
import { updateWarden } from "../warden";
import { updateWisp } from "../wisp";
import type { EnemyKind } from "./kind";

/** the shadow creatures of the night ruins and the Rift Warden */

export const wisp: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 7, e.y - 7, e.x + 7, e.y + 7],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.6, 1.6),
  rift: { height: 11, y: () => rng.range(40, 100), riftY: (y) => y },
  update: updateWisp,
  draw: drawWisp,
  glow: { radius: 16, color: PAL.shadow[3], eyeY: -1 },
  evades: true,
};

export const husk: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 8, e.y - 26, e.x + 8, e.y],
  center: (e) => [e.x, e.y - 13],
  rest: "walk",
  firstCooldown: () => 1,
  rift: { height: 16, y: () => GROUND, riftY: () => GROUND - 14 },
  update: updateHusk,
  draw: drawHusk,
  glow: { radius: 22, color: PAL.shadow[3], eyeY: -6 },
  guardFrom: GUARD.fromWave,
  orbs: 2,
  heartChance: 0.2,
};

export const brute: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 13, e.y - 40, e.x + 13, e.y],
  center: (e) => [e.x, e.y - 20],
  rest: "walk",
  firstCooldown: () => 1,
  rift: { height: 26, y: () => GROUND, riftY: () => GROUND - 22 },
  update: updateBrute,
  draw: drawHusk,
  glow: { radius: 40, color: PAL.shadow[3], eyeY: -6 },
  guardFrom: 1,
};

export const warden: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 17, e.y - 18, e.x + 17, e.y + 16],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => 1,
  rift: { height: 30, y: () => 60, riftY: (y) => y },
  update: updateWarden,
  draw: drawWarden,
  glow: { radius: 40, color: PAL.shadow[3], eyeY: -6 },
};
