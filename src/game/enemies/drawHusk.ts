import { ENEMY_COLORS as EC } from "../../constants/palette";
import { detailCanvas, type SpriteCanvas } from "../../engine/sprite";
import type { Enemy } from "../../types/enemy";
import { WHITE } from "../../utils/color";
import { litOrb, type OrbTones } from "./litOrb";
import { taper } from "./taper";

const huskCanvas = detailCanvas(48, 48, 24, 42);
const bruteCanvas = detailCanvas(80, 76, 40, 70);
const BRUTE_SCALE = 1.6;

const FLESH: OrbTones = {
  deep: EC.bodyDeep,
  dark: EC.bodyDark,
  base: EC.body,
  light: EC.bodyLight,
  rim: EC.rim,
  glint: EC.bodyGlint,
};

/** the eye in image pixels, the husk's and the brute's: "h" hot centre, "c" eye, "g" glow, "s" socket */
const EYES = {
  husk: ["ssss", "shcc", "sccg", ".sg."],
  brute: [".ssss.", "shhccs", "shcccg", "scccgg", ".sgg.."],
};

/** the glowing cracks in the hide, as short jagged lines */
const CRACKS: readonly (readonly [number, number])[][] = [
  [
    [-5, -12],
    [-4, -11],
    [-3.5, -9.5],
  ],
  [
    [-1.5, -15],
    [-0.5, -13.5],
  ],
  [
    [0.5, -9.5],
    [1.5, -8.5],
    [1.5, -7.5],
  ],
];
/** the extra cracks only the brute has */
const BRUTE_CRACKS: readonly (readonly [number, number])[][] = [
  [
    [-6, -15],
    [-5, -14],
    [-5.5, -13],
  ],
  [
    [-0.5, -11.5],
    [0.5, -10.5],
  ],
  [
    [2, -16],
    [3, -15],
  ],
];

/**
 * A hunched horned walker of shadow flesh, lit from the top left: a shell of back plates over the hunch, glowing
 * cracks in the hide, a burning eye, clawed feet and one long arm with lit claws. The brute is the same beast grown
 * huge, with more horns and cracks.
 */
export function drawHusk(e: Enemy, t: number): SpriteCanvas {
  const brute = e.type === "brute";
  const s = brute ? bruteCanvas : huskCanvas;
  const k = brute ? BRUTE_SCALE : 1;
  const step = e.state === "walk" ? Math.floor((t + e.seed) * (brute ? 4 : 6)) % 2 : 0;
  const crouch = e.state === "leap" && e.vy === 0 ? 3 : 0;
  const raised = e.state === "wind" || (e.state === "leap" && e.vy === 0);
  const hand = raised ? [-3, -27] : e.state === "swipe" ? [14, -7] : [8, -6 - step];
  const P = (x: number, y: number): [number, number] => [x * k, y * k + crouch];
  const limb = (x0: number, y0: number, x1: number, y1: number, r0: number, r1: number, c: number) => {
    const [a, b] = P(x0, y0);
    const [c0, d] = P(x1, y1);
    taper(s, a, b, c0, d, r0 * k, r1 * k, c);
  };
  const orb = (x: number, y: number, r: number) => {
    const [a, b] = P(x, y);
    litOrb(s, a, b, r * k, FLESH);
  };
  /** a foot at (x, 0) with two claws reaching forward */
  const foot = (x: number, claw: number) => {
    limb(x + 0.8, 0.6, x + 3.4, 1, 0.55, 0.2, claw);
    limb(x + 0.9, -0.5, x + 3.2, -0.2, 0.45, 0.2, claw);
  };
  s.clear();
  // the far leg and the stub of the far arm, in shadow
  s.begin();
  limb(-3, -8, -4 - step, 0, 1.8, 1.4, EC.bodyDark);
  limb(-1, -14, -6, -11, 1.5, 1.1, EC.bodyDark);
  s.shadeEdges(EC.bodyDark, EC.body, EC.bodyDeep);
  s.commit();
  s.begin();
  foot(-4 - step, EC.clawDeep);
  s.commit();
  // the near leg
  s.begin();
  limb(2, -8, 3 + step, 0, 2, 1.5, EC.body);
  s.shadeEdges(EC.body, EC.bodyLight, EC.bodyDark, 2);
  s.commit();
  s.begin();
  foot(3 + step, EC.clawDeep);
  s.shadeEdges(EC.clawDeep, EC.clawDark, EC.bodyDeep);
  s.commit();
  // the hunched body, its back plates, and the cracks in its hide
  s.begin();
  orb(-1, -13, 6.5);
  s.commit();
  for (const [x, y, r] of [
    [-5.5, -14.5, 2.4],
    [-3.6, -17.2, 2.6],
    [-0.6, -18.6, 2.6],
  ]) {
    const [a, b] = P(x, y);
    s.begin();
    s.dot(a, b, r * k, EC.bodyLight);
    s.shadeEdges(EC.bodyLight, EC.rim, EC.body, Math.round(k * 2));
    s.commit();
  }
  s.begin();
  for (const crack of brute ? [...CRACKS, ...BRUTE_CRACKS] : CRACKS)
    for (let i = 1; i < crack.length; i++) {
      const [a, b] = P(crack[i - 1][0], crack[i - 1][1]);
      const [c, d] = P(crack[i][0], crack[i][1]);
      s.stroke(a, b, c, d, 0.45 * k, EC.crackDeep);
      s.stroke(a, b, c, d, 0.2 * k, EC.crack);
      s.set((a + c) / 2, (b + d) / 2, EC.crackHot);
    }
  s.commit(false);
  // the horns, then the head over their roots
  s.begin();
  limb(4, -21, 1, -26, 1.1, 0.75, EC.claw);
  limb(1, -26, -2, -27, 0.75, 0.4, EC.claw);
  limb(6, -21, 8, -26, 1, 0.4, EC.claw);
  if (brute) {
    limb(-4, -18, -8, -23, 1, 0.4, EC.claw);
    limb(-1, -19, -3, -25, 1, 0.4, EC.claw);
  }
  s.shadeEdges(EC.claw, EC.clawGlint, EC.clawDark, Math.round(k));
  s.commit();
  s.begin();
  orb(5, -18, 3.6);
  s.commit();
  // a fang under the snout, then the burning eye in its socket
  s.begin();
  limb(7.4, -16, 7.8, -14.6, 0.4, 0.15, EC.claw);
  s.shadeEdges(EC.claw, EC.clawGlint, EC.clawDark);
  s.commit();
  s.begin();
  const [ex, ey] = P(7, -19);
  const eye = brute ? EYES.brute : EYES.husk;
  s.pixels(
    eye,
    { s: EC.bodyDeep, h: raised ? WHITE : EC.eyeCore, c: raised ? EC.eyeCore : EC.eye, g: EC.eyeGlow },
    ex - 1,
    ey - 0.5,
  );
  s.commit(false);
  // the long clawed arm
  s.begin();
  limb(3, -14, hand[0], hand[1], 1.5, 1.1, EC.body);
  s.shadeEdges(EC.body, EC.bodyLight, EC.bodyDark, 2);
  s.commit();
  s.begin();
  for (let j = -1; j <= 1; j++) limb(hand[0], hand[1], hand[0] + 3, hand[1] + j * 1.5 + 1, 0.6, 0.2, EC.claw);
  s.shadeEdges(EC.claw, EC.clawGlint, EC.clawDark);
  s.commit();
  s.outline(EC.outline);
  return s;
}
