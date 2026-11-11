import { ENEMY_COLORS as EC } from "../../constants/palette";
import { detailCanvas, type SpriteCanvas } from "../../engine/sprite";
import type { Enemy } from "../../types/enemy";
import { mix, WHITE } from "../../utils/color";
import { clamp } from "../../utils/math";
import { litOrb } from "./litOrb";
import { EYE_DULL, FLESH, FLESH_BRIGHT, INNER_FIRE } from "./night/colors";
import { huskPose } from "./night/huskPose";
import { moonlight } from "./night/moonlight";
import { rigsFor } from "./night/rig";

const huskCanvas = detailCanvas(48, 48, 24, 42);
const bruteCanvas = detailCanvas(80, 76, 40, 70);
const huskRig = rigsFor(huskCanvas);
const bruteRig = rigsFor(bruteCanvas);
const BRUTE_SCALE = 1.6;

/** the eye in image pixels, the husk's and the brute's: "h" hot centre, "c" eye, "g" glow, "s" socket, "d" dull */
const EYES = {
  husk: ["sssss", "sgchs", "sgccs", ".sss."],
  brute: ["sssssss", "sgcchhs", "sgcchhs", "sggccs.", ".ssss.."],
  huskShut: [".ssss.", ".sddds", ".ssss."],
  bruteShut: ["..ssss..", ".ssdddds", "..sssss."],
};
/** the row of teeth along the jaw in image pixels */
const TEETH = { husk: ["t.t.t"], brute: ["t.t.t.t", "t...t.."] };

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
/** the plates over the hunch, as x, y and radius */
const PLATES: readonly (readonly [number, number, number])[] = [
  [-5.5, -14.5, 2.4],
  [-3.6, -17.2, 2.6],
  [-0.6, -18.6, 2.6],
];

/**
 * A hunched horned walker of shadow flesh, lit from the moon's side: a shell of back plates over the hunch, glowing
 * cracks in the hide, a burning eye over a toothed jaw, clawed feet and one long arm with lit claws. It rocks on each
 * step, leans back with its claws spread and its cracks white hot before a blow, throws its weight into the swipe and
 * sags after it. The brute is the same beast grown huge, with more horns and cracks.
 */
export function drawHusk(e: Enemy, t: number): SpriteCanvas {
  const brute = e.type === "brute";
  const s = brute ? bruteCanvas : huskCanvas;
  const g = (brute ? bruteRig : huskRig)(e.face);
  const k = brute ? BRUTE_SCALE : 1;
  const pose = huskPose(e, t);
  /** a point of the body: the upper body leans with height, and the whole of it bobs and crouches */
  const P = (x: number, y: number): [number, number] => {
    const high = clamp((-y - 6) / 14, 0, 1.4);
    const sink = y < -6 ? pose.crouch - pose.bob : 0;
    return [(x + pose.lean * high) * k, (y + sink) * k];
  };
  const limb = (x0: number, y0: number, x1: number, y1: number, r0: number, r1: number, c: number, bend = 0) => {
    const [a, b] = P(x0, y0);
    const [c0, d] = P(x1, y1);
    g.taper(a, b, c0, d, r0 * k, r1 * k, c, bend * k);
  };
  const orb = (x: number, y: number, r: number) => {
    const [a, b] = P(x, y);
    litOrb(s, g.x(a), b, r * k, FLESH);
  };
  /** a foot at (x, -lift) with two claws reaching forward */
  const foot = (x: number, lift: number, claw: number) => {
    limb(x + 0.8, 0.6 - lift, x + 3.4, 1 - lift, 0.55, 0.2, claw);
    limb(x + 0.9, -0.5 - lift, x + 3.2, -0.2 - lift, 0.45, 0.2, claw);
  };
  const fire = mix(EC.crack, EC.crackHot, pose.heat);
  s.clear();
  // the far leg and the stub of the far arm, in shadow
  s.begin();
  limb(-3, -8, pose.farFoot, -pose.farLift, 1.8, 1.4, EC.bodyDark, -0.5);
  limb(-1, -14, -6, -11, 1.5, 1.1, EC.bodyDark);
  s.shadeEdges(EC.bodyDark, EC.body, EC.bodyDeep);
  s.commit();
  s.begin();
  foot(pose.farFoot, pose.farLift, EC.clawDeep);
  s.commit();
  // the near leg
  s.begin();
  limb(2, -8, pose.nearFoot, -pose.nearLift, 2, 1.5, EC.body, -0.6);
  s.shadeEdges(EC.body, FLESH_BRIGHT, EC.bodyDark, 2);
  s.commit();
  s.begin();
  foot(pose.nearFoot, pose.nearLift, EC.clawDark);
  s.shadeEdges(EC.clawDark, EC.claw, EC.clawDeep);
  s.commit();
  // the hunched body, its back plates, and the cracks in its hide
  s.begin();
  orb(-1, -13, 6.5);
  s.commit();
  for (const [x, y, r] of PLATES) {
    const [a, b] = P(x, y);
    s.begin();
    g.dot(a, b, r * k, EC.bodyLight);
    s.shadeEdges(EC.bodyLight, EC.rim, EC.body, Math.round(k * 2));
    s.commit();
  }
  s.begin();
  for (const crack of brute ? [...CRACKS, ...BRUTE_CRACKS] : CRACKS)
    for (let i = 1; i < crack.length; i++) {
      const [a, b] = P(crack[i - 1][0], crack[i - 1][1]);
      const [c, d] = P(crack[i][0], crack[i][1]);
      g.stroke(a, b, c, d, 0.45 * k, EC.crackDeep);
      g.stroke(a, b, c, d, 0.2 * k, fire);
      g.set((a + c) / 2, (b + d) / 2, EC.crackHot);
    }
  s.commit(false);
  // the horns, then the head over their roots
  const nod = pose.droop;
  s.begin();
  limb(4, -21 + nod, 1, -26 + nod, 1.1, 0.75, EC.claw);
  limb(1, -26 + nod, -2, -27 + nod, 0.75, 0.4, EC.claw);
  limb(6, -21 + nod, 8, -26 + nod, 1, 0.4, EC.claw);
  if (brute) {
    limb(-4, -18, -8, -23, 1, 0.4, EC.claw);
    limb(-1, -19, -3, -25, 1, 0.4, EC.claw);
  }
  s.shadeEdges(EC.claw, EC.clawGlint, EC.clawDark, Math.round(k));
  s.commit();
  // the jaw under the snout, open while it strikes
  const gape = pose.heat > 0 ? 1.2 * pose.heat : 0;
  s.begin();
  limb(4.6, -15.6 + nod, 8.4, -15 + nod + gape, 1.1, 0.7, EC.bodyDark);
  s.shadeEdges(EC.bodyDark, EC.body, EC.bodyDeep);
  s.commit();
  s.begin();
  orb(5, -18 + nod, 3.6);
  s.commit();
  // the teeth, a fang, then the burning eye in its socket
  s.begin();
  const [jx, jy] = P(6.2, -16 + nod);
  g.pixels(brute ? TEETH.brute : TEETH.husk, { t: EC.clawGlint }, jx, jy);
  s.commit(false);
  s.begin();
  limb(7.6, -16 + nod, 8, -14.4 + nod, 0.4, 0.15, EC.claw);
  s.shadeEdges(EC.claw, EC.clawGlint, EC.clawDark);
  s.commit();
  s.begin();
  const [ex, ey] = P(7, -19 + nod);
  const hot = pose.heat > 0.5;
  const eye = pose.limp ? (brute ? EYES.bruteShut : EYES.huskShut) : brute ? EYES.brute : EYES.husk;
  g.pixels(
    eye,
    {
      s: EC.bodyDeep,
      h: hot ? WHITE : EC.eyeCore,
      c: hot ? EC.eyeCore : EC.eye,
      g: hot ? INNER_FIRE[3] : EC.eyeGlow,
      d: EYE_DULL,
    },
    ex - 1.5,
    ey - 0.5,
  );
  s.commit(false);
  // the long clawed arm from its shoulder
  const [hx, hy] = pose.hand;
  s.begin();
  limb(3, -14, hx, hy, 1.7, 1.1, EC.body, hy < -15 ? 1.5 : -1);
  s.shadeEdges(EC.body, FLESH_BRIGHT, EC.bodyDark, 2);
  s.commit();
  s.begin();
  const reach = hy < -15 ? -1 : 1;
  for (let j = -1; j <= 1; j++) limb(hx, hy, hx + 3.4, hy + j * 1.5 * pose.spread + reach, 0.65, 0.2, EC.claw, j * 0.3);
  s.shadeEdges(EC.claw, EC.clawGlint, EC.clawDark);
  s.commit();
  moonlight(s, brute);
  g.finish(EC.outline);
  return s;
}
