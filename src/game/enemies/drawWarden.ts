import { ENEMY_COLORS as EC } from "../../constants/palette";
import { detailCanvas, type SpriteCanvas } from "../../engine/sprite";
import type { Enemy } from "../../types/enemy";
import { WHITE } from "../../utils/color";
import { litOrb } from "./litOrb";

const canvas = detailCanvas(76, 76, 38, 34);

/** the eyes in image pixels, slits slanting down to the nose: "s" slit, "h" hot centre, "c" eye, "g" glow */
const EYES = {
  left: ["sss.....", "shccss..", ".sgcggss", "..ssssss"],
  right: [".....sss", "..sscchs", "ssggcgs.", "ssssss.."],
};

/** the mouth slit in image pixels */
const MOUTH = ["mmm"];

/** the glowing rifts that split its body once it is enraged, as jagged lines */
const RIFTS: readonly (readonly [number, number])[][] = [
  [
    [-11, 2],
    [-8, 4],
    [-6, 3.5],
    [-4.5, 6],
  ],
  [
    [10, -6],
    [8, -3],
    [9, -1],
  ],
  [
    [-10, -8],
    [-8.5, -6],
    [-9.5, -4],
  ],
  [
    [3, 9],
    [5, 8],
    [6.5, 10],
  ],
];

/**
 * The Rift Warden: a great floating shadow lit from the top left, with a horned crown, a pale carved mask with burning
 * eyes, two clawed arms and five trailing tendrils of vapour. Enraged, glowing rifts split its body.
 */
export function drawWarden(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const raised = e.state === "volley" || e.state === "summon" || e.state === "wind";
  s.clear();
  s.begin();
  for (let i = 0; i < 5; i++) {
    const ox = (i - 2) * 4;
    const wave = Math.sin(time * 4 + i * 1.7);
    const r = 2.6 - Math.abs(i - 2) * 0.4;
    s.taper(ox, 10, ox - 4 + wave * 4, 24 + (i % 2) * 5, r, r * 0.6, EC.bodyDark, wave * 2);
  }
  s.shadeEdges(EC.bodyDark, EC.body, EC.bodyDeep, 2);
  s.commit(false);
  const armY = raised ? -16 : 6;
  s.begin();
  for (const side of [-1, 1]) s.taper(side * 10, -2, side * 20, armY, 2.4, 1.8, EC.body);
  s.shadeEdges(EC.body, EC.bodyLight, EC.bodyDark, 2);
  s.commit();
  s.begin();
  for (const side of [-1, 1])
    for (let j = -1; j <= 1; j++)
      s.taper(side * 20, armY, side * 24.5, armY + j * 2 + (raised ? -2 : 2), 0.85, 0.25, EC.claw);
  s.shadeEdges(EC.claw, EC.clawGlint, EC.clawDark);
  s.commit();
  // the crown: three horns, rooted under the body
  s.begin();
  s.taper(-6, -9, -10, -22, 1.7, 0.55, EC.claw, -0.8);
  s.taper(0, -11, 0, -25, 1.8, 0.6, EC.claw);
  s.taper(6, -9, 10, -22, 1.7, 0.55, EC.claw, 0.8);
  s.shadeEdges(EC.claw, EC.clawGlint, EC.clawDark, 2);
  s.commit();
  s.begin();
  litOrb(s, 0, 0, 13, {
    deep: EC.bodyDeep,
    dark: EC.bodyDark,
    base: EC.body,
    light: EC.bodyLight,
    rim: EC.rim,
    glint: EC.bodyGlint,
  });
  s.commit();
  if (e.phase === 2) {
    s.begin();
    for (const rift of RIFTS)
      for (let i = 1; i < rift.length; i++) {
        const [a, b] = rift[i - 1];
        const [c, d] = rift[i];
        s.stroke(a, b, c, d, 0.6, EC.crackDeep);
        s.stroke(a, b, c, d, 0.3, EC.crack);
        s.set((a + c) / 2, (b + d) / 2, EC.crackHot);
      }
    s.commit(false);
  }
  // the mask: a ridge down its middle, slanted eye slits and a mouth slit
  s.begin();
  s.poly(
    [
      [-5, -6],
      [7, -6],
      [6, 3],
      [1, 7],
      [-4, 3],
    ],
    EC.mask,
  );
  s.shadeEdges(EC.mask, EC.maskLight, EC.maskShade, 2);
  s.stroke(1, -5, 1, 1, 0.25, EC.maskShade);
  s.pixels(MOUTH, { m: EC.maskDeep }, 0.5, 3);
  const hot = raised || e.phase === 2;
  const map = { s: EC.maskDeep, h: hot ? WHITE : EC.eyeCore, c: hot ? EC.eyeCore : EC.eye, g: EC.eyeGlow };
  s.pixels(EYES.left, map, -3.5, -3);
  s.pixels(EYES.right, map, 1.5, -3);
  s.commit();
  s.outline(EC.outline);
  return s;
}
