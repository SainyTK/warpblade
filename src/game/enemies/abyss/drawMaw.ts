import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix } from "../../../utils/color";
import { AC, VOID } from "./colors";
import { mawPose, turn } from "./mawPose";
import { fang, glowEye, type Pt, sunRim } from "./paint";

const canvas = detailCanvas(104, 84, 52, 76);
const HINGE: Pt = [3, -19];
/** spines along the hump, as base points and how far each leans back */
const SPINES: readonly (readonly [number, number, number])[] = [
  [-20, -16, 4],
  [-16, -22, 5],
  [-11, -27, 6],
  [-5, -29, 6],
  [1, -29, 4],
];
/** the hump as overlapping masses, tail to shoulder: centres and radii */
const HUMP: readonly (readonly [number, number, number])[] = [
  [-16, -11, 9.3],
  [-8, -17, 12.8],
  [0, -19, 9.8],
];
/** how far the lit dome sits up and back from the hump's full mass, leaving a crescent of shadow under the belly */
const LIT_SHIFT = 1;

/** the chitin plates over the hump, back to front, as centres and radii */
const PLATES: readonly (readonly [number, number, number])[] = [
  [-10, -22, 6],
  [-2.5, -24, 3.8],
];
const EYES: readonly Pt[] = [
  [8.5, -26.5],
  [12.5, -25.5],
  [6.5, -23.5],
  [15.5, -23.5],
];
/** a crack of void light down the flank, as a path of points */
const CRACK: readonly Pt[] = [
  [-15, -21],
  [-12, -17],
  [-13, -13],
  [-9, -10],
];

/** where the lower jaw's top edge runs, as y at this x along it */
const lowerEdge = (x: number): number => -18 + ((x - 1) * 3) / 23;

/**
 * A hulking hunched crawler that is mostly mouth: a spined, plated hump cracked with void light, clustered eyes, and
 * fanged jaws that open on a burning gullet.
 */
export function drawMaw(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = mawPose(e, time);
  const step = e.state === "walk" ? Math.floor(time * 3) % 2 : 0;
  const lift = e.state === "walk" ? step : 0;
  // the body rears around its hind foot
  const B = (x: number, y: number): [number, number] => {
    const [a, b] = turn([x, y], [-16, 0], p.rear);
    return [a, Math.min(b - lift, 0)];
  };
  const upper = (x: number, y: number) => B(...turn([x, y], HINGE, -p.gape * 0.5));
  const lower = (x: number, y: number) => B(...turn([x, y], HINGE, p.gape * 0.42));
  /** hooked claws fanning forward from a hand or foot */
  const claws = (x: number, y: number, n: number, c: number) => {
    for (let j = 0; j < n; j++) fang(s, [x + 1, y - 1.2 + j * 1.1], [x + 4.6, y - 0.3 + j * 0.3], 1.3, c);
  };
  s.clear();
  // far limbs, in shadow
  s.begin();
  s.taper(...B(-14, -10), -19 - step, -4, 2.8, 2.4, AC.bodyDark);
  s.taper(-19 - step, -4, -16 - step, 0, 2.4, 2, AC.bodyDark);
  s.taper(...B(1, -15), ...B(7, -8), 2.8, 2.4, AC.bodyDark);
  s.taper(...B(7, -8), 9 + step, 0, 2.4, 2, AC.bodyDark);
  s.shadeEdges(AC.bodyDark, AC.body, AC.bodyDeep);
  claws(9 + step, 0, 2, AC.clawDeep);
  s.shadeEdges(AC.clawDeep, AC.clawDark, AC.bodyDeep);
  s.commit(false);
  // the spines along the hump, thinning to points
  s.begin();
  SPINES.forEach(([x, y, back], i) => {
    // the spines rise and settle with its breath, one after another along the hump
    const bristle = Math.sin(time * 2 + i * 0.8) * 0.8;
    s.taper(...B(x, y), ...B(x - back, y - 5.5 - bristle), 1.3, 0.35, AC.plate);
  });
  s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark);
  s.commit();
  // the hump, lit from the top left with a deep shadow under its belly
  s.begin();
  for (const [x, y, r] of HUMP) s.dot(...B(x, y), r, AC.bodyDark);
  for (const [x, y, r] of HUMP) s.dot(...B(x - LIT_SHIFT, y - LIT_SHIFT * 1.6), r - LIT_SHIFT * 1.9, AC.body);
  s.shadeEdges(AC.body, AC.sheen, AC.body);
  s.shadeEdges(AC.bodyDark, AC.bodyDark, AC.bodyDeep, 4);
  s.commit();
  // chitin plates over the hump, each overlapping the one behind it, a glint on each ridge
  for (const [x, y, r] of PLATES) {
    s.begin();
    s.dot(...B(x, y), r, AC.plate);
    s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark, 2);
    s.block(...B(x - r * 0.45, y - r * 0.7), AC.plateGlint, 1, 0.5);
    s.commit();
  }
  // a crack of void light down the flank, burning brighter with the gullet
  s.begin();
  for (let i = 1; i < CRACK.length; i++) s.stroke(...B(...CRACK[i - 1]), ...B(...CRACK[i]), 0.45, VOID[2]);
  for (let i = 1; i < CRACK.length; i++)
    s.stroke(...B(...CRACK[i - 1]), ...B(...CRACK[i]), 0.2, p.heat > 0.6 ? VOID[5] : p.heat > 0.3 ? VOID[4] : VOID[3]);
  s.commit(false);
  // the near hind leg
  s.begin();
  s.taper(...B(-14, -10), -14 + step, 0, 3.3, 2.8, AC.body);
  s.shadeEdges(AC.body, AC.sheen, AC.bodyDark, 2);
  claws(-14 + step, 0, 2, AC.claw);
  s.shadeEdges(AC.claw, AC.clawLight, AC.clawDark);
  s.commit();
  // the gullet, burning brighter as it gathers a spit or a bite, a tongue lolling on the lower jaw
  s.begin();
  const gul = mix(AC.gullet, VOID[3], p.heat * 0.6);
  s.poly([B(...HINGE), upper(25, -19), lower(23, -15)], gul);
  s.stroke(...B(...HINGE), ...upper(25, -19.4), 0.7, AC.gulletDeep);
  for (const x of [6, 12]) s.stroke(...upper(x, -18.6), ...lower(x - 0.5, lowerEdge(x) + 0.6), 0.25, AC.gulletDeep);
  if (p.gape > 0.25) {
    s.dot(...B(9, -18), 2.5 + p.heat * 2, mix(AC.gulletHot, VOID[4], p.heat));
    s.dot(...B(8.6, -18.2), 1 + p.heat * 1.2, p.heat > 0.6 ? VOID[5] : AC.gulletHot);
    s.block(...B(7.5, -18.7), AC.eyeHot, 1, 1);
  }
  s.commit(false);
  // the lower jaw with its upturned fangs
  s.begin();
  s.poly([lower(1, -18), lower(24, -15), lower(22, -10), lower(7, -6), lower(0, -10)], AC.body);
  s.shadeEdges(AC.body, AC.sheen, AC.bodyDark, 2);
  s.poly([lower(6, -8), lower(21, -11), lower(22, -10), lower(7, -6)], AC.bodyDeep);
  s.taper(...lower(5, lowerEdge(5) + 0.3), ...lower(19, lowerEdge(19) + 0.3), 1, 0.7, mix(AC.gullet, AC.rimSoft, 0.4));
  for (let x = 7; x <= 22; x += 3) {
    const y = lowerEdge(x);
    fang(s, lower(x + 0.5, y + 0.6), lower(x + 0.8, y - (x % 2 ? 2.8 : 2)), 1.8, AC.tooth);
  }
  s.shadeEdges(AC.tooth, AC.toothLight, AC.toothDark);
  s.commit();
  // the upper jaw and its downturned fangs
  s.begin();
  s.poly([upper(-2, -30), upper(14, -30), upper(26, -23), upper(25, -19), upper(3, -19)], AC.body);
  s.shadeEdges(AC.body, AC.sheen, AC.bodyDark, 2);
  for (let x = 7; x <= 24; x += 3) fang(s, upper(x + 0.5, -19.8), upper(x + 0.8, x % 2 ? -16.4 : -17.2), 1.8, AC.tooth);
  s.shadeEdges(AC.tooth, AC.toothLight, AC.toothDark);
  s.block(...upper(23, -22), AC.bodyDeep, 1, 0.5);
  s.commit();
  // the brow plate over the jaw, its eye sockets and the cluster of burning eyes
  s.begin();
  s.poly([upper(0, -29), upper(13, -29), upper(20, -26), upper(4, -25)], AC.plate);
  s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark);
  s.block(...upper(2, -29), AC.plateGlint, 1.5, 0.5);
  s.commit();
  s.begin();
  const hot = e.state === "wind" || e.state === "charge" || e.state === "volley";
  EYES.forEach(([x, y], i) => {
    s.dot(...upper(x, y), 1, AC.bodyDeep);
    const blink = (time + i * 0.9) % 4.3 < 0.1;
    if (!blink) glowEye(s, ...upper(x, y), hot ? AC.eyeHot : AC.eye, hot ? AC.eye : AC.eyeDim, AC.eyeHot);
  });
  s.commit(false);
  // the near arm, a plate at its elbow and its hooked claws
  s.begin();
  const [hx, hy] = e.state === "volley" ? B(...p.hand) : p.hand;
  const elbow = B(10, -9);
  s.taper(...B(5, -15), ...elbow, 3.3, 2.9, AC.body);
  s.taper(...elbow, hx, hy - 2, 2.9, 2.5, AC.body);
  s.shadeEdges(AC.body, AC.sheen, AC.bodyDark, 2);
  s.commit();
  s.begin();
  s.dot(...elbow, 2, AC.plate);
  s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark);
  s.commit();
  s.begin();
  for (let j = -1; j <= 1; j++) s.taper(hx + 1, hy - 2, hx + 5.5, hy - 1.5 + j * 1.8, 0.8, 0.3, AC.claw);
  s.shadeEdges(AC.claw, AC.clawLight, AC.clawDark);
  s.commit();
  sunRim(s, AC.rim, AC.rimSoft);
  s.outline(AC.outline);
  return s;
}
