import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { AC, clipBelow, hideOf, VOID } from "./colors";
import { drawStalkerPool } from "./drawStalkerPool";
import { fang, glowEye, type Pt, sunRim } from "./paint";
import { RISE, SINK } from "./stalker";

const canvas = detailCanvas(64, 54, 32, 46);
/** the plates down its spine, as points along the back and their radius, tail end first */
const PLATES: readonly (readonly [number, number, number])[] = [
  [-6, -13, 1.8],
  [-2.5, -13.8, 2],
  [1, -14, 1.7],
];

const SPINES: readonly number[] = [-8, -5, -2, 1];
/** where the ribs show through the hide, along the flank */
const RIBS: readonly number[] = [-3.5, -1.5, 0.5];

/** how far below the floor the body is: sinking into its pool, then climbing back out as it rises */
function depth(e: Enemy): number {
  if (e.state === "burrow") return e.n === 0 ? 20 * clamp(e.st / SINK) ** 2 : 20;
  if (e.state === "charge") return 20;
  if (e.state === "hop") return 18 * (1 - clamp(e.st / (RISE * 0.45)));
  return 0;
}

/**
 * A lean void hound on four long limbs: black hide with a violet sheen, chitin plates and spines down its back,
 * a barbed whip tail and a bone scythe on its foreleg that it raises before a cut.
 */
export function drawStalker(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const sink = depth(e);
  const H = hideOf(e.seed);
  s.clear();
  if (sink < 20) {
    const step = e.state === "walk" ? Math.floor(time * 7) % 2 : 0;
    const wind = e.state === "wind";
    const prowl = e.state === "walk" ? Math.round(Math.sin(time * 14) * 0.5) : 0;
    const hunch = wind ? -2 : e.state === "swipe" ? 1 : 0;
    const hot = wind || e.state === "hop";
    const y0 = sink + prowl;
    // rising, it rears up on its hind feet, nose to the sky
    const rear = e.state === "hop" ? -0.75 * (1 - clamp(e.st / RISE) ** 2) : 0;
    const ca = Math.cos(rear);
    const sa = Math.sin(rear);
    const P = (x: number, y: number): Pt => [-6 + (x + 6) * ca - y * sa, (x + 6) * sa + y * ca + y0];
    /** a limb from the body to a knee, then down to a foot on the floor with a hooked claw */
    const leg = (a: Pt, b: Pt, c: Pt, r: number, col: number) => {
      const knee = P(...b);
      const [fx, fy] = rear ? P(...c) : [c[0], c[1] + sink];
      const foot: Pt = [fx, Math.min(fy, sink)];
      s.taper(...P(...a), ...knee, r * 1.3, r, col);
      s.taper(...knee, ...foot, r, r * 0.7, col);
      fang(s, [foot[0], foot[1] - 0.4], [foot[0] + 1.6, foot[1] + 0.2], 0.9, col);
    };
    const elbow: Pt = e.state === "hop" ? [6, -21] : wind ? [1, -20] : e.state === "swipe" ? [11, -12] : [8, -8 - step];
    const tip: Pt = e.state === "hop" ? [11, -31] : wind ? [-4, -26] : e.state === "swipe" ? [19, -7] : [11, -1 - step];
    // far limbs, in shadow
    s.begin();
    leg([-7, -10 + hunch], [-11 + step, -5], [-8 + step, 0], 1.3, H.deep);
    leg([3, -11 + hunch], [5 - step, -6], [3 - step, 0], 1.2, H.deep);
    s.shadeEdges(H.deep, H.dark, H.deep);
    s.commit(false);
    // the whip tail, swaying, ending in a barb
    s.begin();
    const sway = Math.sin(time * 4) * 2;
    const tailMid = P(-14, -16 + sway * 0.5);
    const tailEnd = P(-19, -13 + sway);
    s.taper(...P(-9, -12 + hunch), ...tailMid, 1.5, 1.1, H.body);
    s.taper(...tailMid, ...tailEnd, 1.1, 0.7, H.body);
    s.shadeEdges(H.body, H.sheen, H.dark);
    fang(s, tailEnd, P(-21.5, -8.5 + sway), 1.6, AC.rimSoft);
    s.shadeEdges(AC.rimSoft, AC.rim, AC.gullet);
    s.commit();
    // the spines along the back, behind the body
    s.begin();
    for (const x of SPINES) {
      // the spines bristle in a wave that runs down the back
      const h = (x === -5 || x === -2 ? 5 : 3) + Math.sin(time * 5 + x * 0.9) * 0.7;
      s.taper(...P(x, -14.5 + hunch), ...P(x - 2, -15.5 - h + hunch), 0.9, 0.3, AC.plate);
    }
    s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark);
    s.commit();
    // the near hind leg
    s.begin();
    leg([-5, -10 + hunch], [-8 - step, -5], [-5 - step, 0], 1.5, H.dark);
    s.shadeEdges(H.dark, H.body, H.deep);
    s.commit();
    // the lean torso and neck, ribs showing under the hide
    s.begin();
    s.stroke(...P(-7, -11 + hunch), ...P(2, -13 + hunch), 4.4, H.body);
    s.stroke(...P(2, -13 + hunch), ...P(7, -15 + hunch), 2.8, H.body);
    // the belly hangs in its own shadow, so the lit back reads over whatever stands behind
    s.stroke(...P(-6.5, -8.3 + hunch), ...P(2.5, -9.8 + hunch), 1.7, H.dark);
    s.shadeEdges(H.body, H.sheen, H.dark, 3);
    s.shadeEdges(H.dark, H.dark, H.deep, 2);
    // void light burns between its ribs: a slow pulse at rest, white hot as it gathers to strike
    const ember = Math.sin(time * 3) > 0.3 ? VOID[3] : VOID[2];
    const rib = hot ? VOID[5] : ember;
    for (const x of RIBS) {
      s.hairline(...P(x, -12 + hunch), ...P(x + 0.9, -9.2 + hunch), hot ? VOID[4] : VOID[1]);
      s.hairline(...P(x + 0.25, -11.4 + hunch), ...P(x + 0.9, -9.8 + hunch), rib);
    }
    s.commit();
    // chitin plates down the spine, a dark seam between each and a glint on its ridge
    s.begin();
    for (const [x, y, r] of PLATES) s.dot(...P(x, y + hunch), r, AC.plate);
    s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark);
    for (const [x, y, r] of PLATES) {
      s.hairline(...P(x + r * 0.9, y - r * 0.8 + hunch), ...P(x + r * 0.9, y + r + hunch), AC.plateDark);
      const g = P(x - r * 0.4, y - r * 0.6 + hunch);
      s.set(g[0], g[1], AC.plateGlint);
    }
    s.commit();
    // the head: a long skull with a lit brow plate, a jaw line, fangs and two burning eyes
    s.begin();
    s.poly([P(5, -19 + hunch), P(10, -19 + hunch), P(15, -15 + hunch), P(13, -13 + hunch), P(6, -12 + hunch)], H.body);
    s.shadeEdges(H.body, H.sheen, H.dark, 2);
    s.stroke(...P(9, -13.5 + hunch), ...P(14, -13.5 + hunch), 0.3, H.deep);
    for (const x of [11.5, 13.5]) {
      fang(s, P(x, -13.2 + hunch), P(x + 0.2, -11.4 + hunch), 0.9, AC.tooth);
      const g = P(x - 0.25, -13 + hunch);
      s.set(g[0], g[1], AC.toothLight);
    }
    s.commit();
    s.begin();
    s.poly([P(6, -18 + hunch), P(10, -18 + hunch), P(12, -16 + hunch), P(7, -15 + hunch)], AC.plate);
    s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark);
    const brow = P(7, -18 + hunch);
    s.set(brow[0], brow[1], AC.plateGlint);
    glowEye(s, ...P(10.5, -16.5 + hunch), hot ? AC.eyeHot : AC.eye, hot ? AC.eye : AC.eyeDim, AC.eyeHot);
    glowEye(s, ...P(12.5, -15.5 + hunch), hot ? AC.eyeHot : AC.eye, hot ? AC.eye : AC.eyeDim, AC.eyeHot);
    s.commit();
    // the scythe foreleg and its long pale blade, its cutting edge catching the light
    s.begin();
    s.taper(...P(3, -12 + hunch), ...P(...elbow), 2, 1.5, H.body);
    s.shadeEdges(H.body, H.sheen, H.dark);
    s.commit();
    s.begin();
    const [ex, ey] = P(...elbow);
    const [tx, ty] = P(...tip);
    s.taper(ex, ey, tx, ty, 1.3, 0.4, AC.claw);
    s.shadeEdges(AC.claw, AC.clawLight, AC.clawDark);
    s.dot(ex, ey, 1.1, AC.plateDark);
    s.dot(tx, ty, 0.55, wind ? AC.eyeHot : AC.clawLight);
    // raised to cut, the blade's edge runs white from elbow to tip
    if (wind) s.hairline(ex, ey - 0.5, tx, ty - 0.5, AC.eyeHot);
    s.commit();
    sunRim(s, AC.rim, AC.rimSoft);
    if (sink > 0) clipBelow(s, 1);
  }
  if (sink > 0) drawStalkerPool(s, e, t);
  s.outline(AC.outline);
  return s;
}
