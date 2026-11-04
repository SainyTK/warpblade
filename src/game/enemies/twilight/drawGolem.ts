import { SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { TWILIGHT_COLORS as TC } from "./colors";

const canvas = new SpriteCanvas(56, 50, 28, 45);
type Pt = readonly [number, number];
/** rune marks cut into the chest, as pixel offsets */
const CHEST_RUNES: readonly Pt[] = [
  [-3, -15],
  [-3, -14],
  [-3, -13],
  [-2, -12],
  [-1, -13],
  [-1, -14],
  [-1, -15],
  [1, -11],
  [2, -11],
  [3, -11],
  [2, -10],
  [2, -9],
  [-6, -9],
  [-5, -8],
  [-6, -7],
];

/** how bright the runes burn: a slow pulse at rest, flaring up through a wind-up */
function runeHeat(e: Enemy, t: number): number {
  const w = waveScale(game.wave).windup;
  if (e.state === "charge") return clamp(e.st / (0.8 * w));
  if (e.state === "wind") return clamp(e.st / (0.6 * w));
  if (e.state === "swipe" || (e.state === "recover" && e.st < 0.15)) return 1;
  return 0.2 + Math.sin(t * 2.2 + e.seed) * 0.12;
}

/** a squat stone construct, moss on its shoulders, runes in its chest that blaze before it punches or slams */
export function drawGolem(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const g = runeHeat(e, t);
  const step = e.state === "walk" ? Math.floor((t + e.seed) * 3) % 2 : 0;
  const slammed = e.state === "recover" && e.n === 1 && e.st < 0.45;
  const raised = e.state === "charge";
  const drop = slammed ? 2 : raised ? -1 : step;
  const rune = g > 0.8 ? TC.runeHot : g > 0.4 ? TC.rune : mix(TC.runeDim, TC.rune, g * 2);
  const backFist: Pt = raised ? [-3, -31] : slammed ? [-1, -2] : [-9, -7 + step];
  const frontFist: Pt =
    e.state === "wind"
      ? [-4, -17]
      : e.state === "swipe"
        ? [17, -11]
        : raised
          ? [6, -32]
          : slammed
            ? [11, -2]
            : [10, -6];
  s.clear();
  // back arm and leg, in shadow
  s.begin();
  s.stroke(-4, -5, -6 - step, 0, 2.6, TC.stoneDark);
  s.stroke(-5, -16 + drop, backFist[0], backFist[1], 2.4, TC.stoneDark);
  s.dot(backFist[0], backFist[1], 3.2, TC.stoneDark);
  s.commit();
  // the boulder body
  s.begin();
  s.stroke(3, -5, 4 + step, 0, 2.8, TC.stone);
  s.set(4 + step, -1, TC.stoneLight);
  const body: Pt[] = [
    [-10, -6],
    [-11, -14],
    [-7, -20],
    [3, -21],
    [9, -17],
    [10, -8],
    [7, -3],
    [-7, -3],
  ];
  s.poly(
    body.map(([x, y]) => [x, y + drop] as const),
    TC.stone,
  );
  s.poly(
    [
      [-9, -14 + drop],
      [-6, -19 + drop],
      [3, -20 + drop],
      [8, -16 + drop],
      [3, -15 + drop],
      [-5, -13 + drop],
    ],
    TC.stoneLight,
  );
  for (let x = -6; x <= 3; x++) s.set(x, -21 + drop, TC.stoneRim);
  for (let y = -16; y <= -9; y++) s.set(9, y + drop, TC.stoneRim);
  s.set(-4, -7 + drop, TC.stoneDark);
  s.set(5, -6 + drop, TC.stoneDark);
  s.set(6, -6 + drop, TC.stoneDark);
  for (const [x, y] of CHEST_RUNES) s.set(x, y + drop, rune);
  // the moss over its shoulders, glowing faintly
  for (const [x, h] of [
    [-7, 1],
    [-6, 2],
    [-5, 1],
    [-2, 1],
    [-1, 2],
    [0, 1],
  ])
    for (let k = 0; k < h; k++) s.set(x, -21 - k + drop, k === h - 1 ? TC.mossTip : TC.moss);
  s.commit();
  // the head, sunk into the shoulders, with one slit eye
  s.begin();
  s.poly(
    [
      [1, -26 + drop],
      [7, -26 + drop],
      [8, -20 + drop],
      [1, -19 + drop],
    ],
    TC.stoneLight,
  );
  for (let x = 2; x <= 6; x++) s.set(x, -26 + drop, TC.stoneRim);
  s.set(5, -23 + drop, g > 0.5 ? WHITE : TC.eye);
  s.set(6, -23 + drop, g > 0.5 ? WHITE : TC.eye);
  s.set(7, -23 + drop, rune);
  s.commit();
  // the front arm and its great fist
  s.begin();
  s.stroke(5, -16 + drop, frontFist[0], frontFist[1], 2.6, TC.stone);
  s.dot(frontFist[0], frontFist[1], 3.6, TC.stoneLight);
  s.set(frontFist[0] + 1, frontFist[1] - 2, TC.stoneRim);
  s.set(frontFist[0] + 2, frontFist[1] - 1, TC.stoneRim);
  s.set(frontFist[0], frontFist[1], rune);
  s.set(frontFist[0] + 1, frontFist[1] + 1, rune);
  s.commit();
  s.outline(TC.outline);
  return s;
}
