import type { SpriteCanvas } from "../../../engine/sprite";
import { mix, WHITE } from "../../../utils/color";
import { RAIN_FOES as C } from "./colors";
import { glint } from "./detail";
import { type Crack, drawCracks } from "./hulkCracks";
import { drawHulkEyes } from "./hulkEyes";
import type { HulkLook } from "./hulkLook";
import { drawMotes } from "./hulkMotes";

const REEDS = [
  [-9, -13, -12, -3],
  [-4, -15, -14, -6],
] as const;
const MOTES = [
  [-8, -9],
  [-2, -12],
  [4, -7],
  [-12, -6],
] as const;
const PEBBLES = [
  [-6, -5, 1],
  [6, -10, 0.8],
] as const;
const CRACKS: readonly Crack[] = [
  [
    [-13, -11],
    [-10, -13],
    [-7, -11.5],
    [-4, -14],
    [-1, -12],
    [2, -14],
  ],
  [
    [-15, -6],
    [-12, -3.5],
    [-9, -5.5],
  ],
  [
    [3, -5],
    [6, -8],
    [9, -5.5],
  ],
];
const HEAD = { x: 15, y: -6.5, r: 5 } as const;

function drawFist(
  s: SpriteCanvas,
  from: readonly [number, number],
  at: readonly [number, number],
  r: number,
  c: number,
): void {
  s.taper(from[0], from[1], at[0], at[1], r * 0.7, r * 0.8, c);
  s.dot(at[0], at[1], r, c);
}

export function drawSlidePose(s: SpriteCanvas, look: HulkLook, sliding: boolean): void {
  const { time } = look;
  const sway = sliding ? Math.sin(time * 30) * 0.4 : 0;
  s.begin();
  for (const [x0, y0, dx, dy] of REEDS) s.stroke(x0, y0, x0 + dx, y0 + dy + sway, 0.5, C.reed);
  s.shadeEdges(C.reed, C.reedLight, C.reedDark);
  s.commit(false);
  s.begin();
  const head = mix(C.cattail, C.mudDeep, 0.6);
  for (const [x0, y0, dx, dy] of REEDS)
    s.stroke(x0 + dx * 0.85, y0 + dy * 0.85 + sway, x0 + dx, y0 + dy + sway, 0.9, head);
  s.shadeEdges(head, C.cattail, C.mudDeep);
  s.commit();
  s.begin();
  drawFist(s, [-8, -8], [-21, -3], 3.6, C.mudDark);
  s.shadeEdges(C.mudDark, C.mud, C.mudDeep, 2);
  s.commit();
  s.begin();
  s.dot(-10, -7, 6.5, C.mudDark);
  s.dot(-11, -7.5, 6, C.mud);
  s.dot(-2, -8, 8, C.mud);
  s.dot(7, -7, 7, C.mud);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark, 2);
  s.shadeEdges(C.mudDark, C.mud, C.mudDeep, 3);
  s.dot(-3, -12, 4.6, mix(C.mud, C.mudLight, 0.5));
  s.dot(-4, -12.6, 3.4, C.mudLight);
  for (let a = 3.6; a < 5; a += 0.04) s.set(-2 + Math.cos(a) * 7.4, -8 + Math.sin(a) * 7.4, C.wetSky);
  for (let a = 3.9; a < 4.4; a += 0.04) s.set(-2 + Math.cos(a) * 7.8, -8 + Math.sin(a) * 7.8, WHITE);
  glint(s, -6, -13.5, WHITE);
  for (const [x, y, r] of PEBBLES) {
    s.dot(x, y, r + 0.4, C.pebbleDark);
    s.dot(x - 0.15, y - 0.15, r, C.pebble);
    s.set(x - 0.4, y - 0.5, C.pebbleLight);
  }
  if (look.cracked) drawCracks(s, CRACKS, look.gathered);
  drawMotes(s, look, MOTES, 0);
  s.commit();
  s.begin();
  drawFist(s, [-3, -6], [-17, -2.5], 4.2, C.mud);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark, 2);
  s.dot(-18, -4, 2, C.mudLight);
  glint(s, -19.5, -5.5, WHITE);
  for (let j = -1; j <= 1; j++) s.hairline(-21.5, -2.5 + j * 1.5, -20, -2.5 + j * 1.5, C.mudDeep);
  s.commit();
  s.begin();
  s.dot(HEAD.x, HEAD.y, HEAD.r, C.mud);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark, 2);
  s.dot(HEAD.x - 1, HEAD.y - 2, 3, C.mudLight);
  s.stroke(HEAD.x - 3, HEAD.y - 3, HEAD.x + 4.5, HEAD.y - 2, 1.1, C.mudLight);
  s.shadeEdges(C.mudLight, C.mudRim, C.mudLight);
  s.hairline(HEAD.x - 1.5, HEAD.y - 1.4, HEAD.x + 5, HEAD.y - 0.6, C.mudDeep);
  for (let a = -2.5; a < -1.3; a += 0.08) s.set(HEAD.x + Math.cos(a) * 4.9, HEAD.y + Math.sin(a) * 4.9, C.wetSky);
  drawHulkEyes(s, look, [
    [HEAD.x + 2, HEAD.y - 0.5],
    [HEAD.x + 4, HEAD.y],
  ]);
  s.taper(HEAD.x, HEAD.y + 3.5, HEAD.x + 5, HEAD.y + 2.5, 0.7, 1.1, C.maw);
  s.commit();
  if (!sliding) return;
  s.begin();
  const surge = (time * 9) % 1;
  s.dot(21 + surge, -1, 2.2, C.mud);
  s.dot(24 + surge * 2, -0.5, 1.3, C.mud);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark);
  glint(s, 20.5, -2.8, C.wetSky);
  s.commit();
}
