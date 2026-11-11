import type { Color } from "../../../types/color";
import { VOID } from "./colors";
import type { Pt } from "./paint";
import { HIP, joint, LIMB, type SovereignBody } from "./sovereignBody";
import { ARMOUR, MANTLE } from "./sovereignColors";

/** a leg's plate tones: the near leg in the light, the far one a step into shadow */
interface Plate {
  base: Color;
  light: Color;
  dark: Color;
}
const NEAR: Plate = { base: ARMOUR.base, light: ARMOUR.sheen, dark: ARMOUR.dark };
const FAR: Plate = { base: ARMOUR.dark, light: ARMOUR.light, dark: ARMOUR.deep };
/** the ankle sits this far above the foot's sole */
const ANKLE = 1.6;
/** greave radii: thigh at the hip and knee, shin at the knee and ankle, and the knee plate */
const GREAVE = { hip: 3.1, knee: 2.5, shin: 2.3, ankle: 1.7, cop: 2 } as const;
/** the tabard that hangs from the belt between the legs: its width at the belt and hem, and its length */
const TABARD = { top: 3.4, hem: 2.4, long: 15 } as const;
/** how fast and far the tabard sways, and how far it streams back and lifts when the body billows */
const TABARD_SWAY = { rate: 2.6, far: 0.8, back: 2, lift: 3 } as const;
/** a plate of the skirt reaches this share down the thigh, its lames this share down the plate */
const TASSET = { reach: 0.55, lames: [0.38, 0.7] } as const;

/** one leg from its hip to a sabaton on the floor: a plated thigh, a spiked knee plate and a greave */
function leg(b: SovereignBody, hip: Pt, foot: Pt, tone: Plate): void {
  const { g } = b;
  const ankle: Pt = [foot[0], foot[1] - ANKLE];
  const knee = joint(hip, ankle, LIMB.thigh, LIMB.shin, -1);
  b.g.s.begin();
  g.taper(...hip, ...knee, GREAVE.hip, GREAVE.knee, tone.base);
  g.taper(...knee, ...ankle, GREAVE.shin, GREAVE.ankle, tone.base);
  // the sabaton: a pointed iron foot flat on the floor
  g.poly(
    [
      [foot[0] - 2.4, foot[1] - 2.6],
      [foot[0] + 2.2, foot[1] - 2],
      [foot[0] + 4.6, foot[1] - 0.2],
      [foot[0] + 4.6, foot[1]],
      [foot[0] - 2.6, foot[1]],
    ],
    tone.base,
  );
  b.g.s.shadeEdges(tone.base, tone.light, tone.dark, 2);
  // a seam where the greave meets the sabaton, and the shin's lit ridge
  g.hairline(foot[0] - 2, foot[1] - 2.4, foot[0] + 2, foot[1] - 1.8, tone.dark);
  g.hairline(knee[0] + b.lit * 0.8, knee[1] + 2, ankle[0] + b.lit * 0.8, ankle[1] - 1, tone.light);
  b.g.s.commit();
  // the knee plate with a short spike pointing forward
  b.g.s.begin();
  g.dot(...knee, GREAVE.cop, tone.base);
  g.taper(knee[0] + 1, knee[1], knee[0] + 3.6, knee[1] - 0.6, 1, 0.2, tone.base);
  b.g.s.shadeEdges(tone.base, tone.light, tone.dark, 2);
  b.g.s.commit();
}

/** a plate of the skirt hanging from the belt over a thigh, from belt points a and b down toward the knee */
function tasset(b: SovereignBody, a: Pt, c: Pt, hip: Pt, foot: Pt, tone: Plate): void {
  const { g } = b;
  const knee = joint(hip, [foot[0], foot[1] - ANKLE], LIMB.thigh, LIMB.shin, -1);
  // the plate swings with the thigh, reaching a little over halfway down it
  const dx = (knee[0] - hip[0]) * TASSET.reach;
  const dy = (knee[1] - hip[1]) * TASSET.reach;
  b.g.s.begin();
  g.poly(
    [
      [a[0] - 0.5, a[1]],
      [c[0] + 0.5, c[1]],
      [c[0] + dx + 1.2, c[1] + dy],
      [a[0] + dx - 0.6, a[1] + dy + 0.6],
    ],
    tone.base,
  );
  b.g.s.shadeEdges(tone.base, tone.light, tone.dark, 2);
  // two lames, each with a dark seam and its trim catching the void light when enraged
  for (const share of TASSET.lames) {
    const y0 = a[1] + dy * share;
    const y1 = c[1] + dy * share;
    g.hairline(a[0] + dx * share, y0, c[0] + dx * share + 0.5, y1, tone.dark);
    g.hairline(a[0] + dx * share, y0 - 0.5, c[0] + dx * share + 0.5, y1 - 0.5, b.enraged ? VOID[2] : ARMOUR.trim);
  }
  b.g.s.commit();
}

/** the tabard: a strip of mantle cloth between the legs, swaying, an eye of void light worked into it */
function tabard(b: SovereignBody): void {
  const { g, time, pose } = b;
  const left = b.at(1 - TABARD.top, -22.5);
  const right = b.at(1 + TABARD.top, -22.5);
  const sway = Math.sin(time * TABARD_SWAY.rate) * TABARD_SWAY.far - pose.billow * TABARD_SWAY.back;
  const hemY = left[1] + TABARD.long - pose.billow * TABARD_SWAY.lift;
  const mid = (left[0] + right[0]) / 2 + sway;
  b.g.s.begin();
  g.poly(
    [
      left,
      right,
      [mid + TABARD.hem, hemY - 1],
      [mid + 0.6, hemY + 1],
      [mid - 0.4, hemY - 0.6],
      [mid - TABARD.hem, hemY + 0.4],
    ],
    MANTLE.base,
  );
  b.g.s.shadeEdges(MANTLE.base, MANTLE.fold, MANTLE.deep, 2);
  g.hairline(mid - 0.6, hemY - 1, (left[0] + right[0]) / 2 - 0.6, left[1] + 2, MANTLE.dark);
  // the eye sewn into it, burning a little brighter as a blow gathers
  const [ex, ey] = [(left[0] + right[0]) / 2 + sway * 0.4, left[1] + 5];
  g.poly(
    [
      [ex - 1.4, ey],
      [ex, ey - 0.9],
      [ex + 1.4, ey],
      [ex, ey + 0.9],
    ],
    VOID[1],
  );
  g.set(ex, ey, b.hot ? VOID[5] : VOID[3]);
  g.set(ex - 0.5, ey, VOID[3]);
  b.g.s.commit();
}

/** both legs, the skirt of plates over them and the tabard between, the far leg first and in shadow */
export function drawLegs(b: SovereignBody): void {
  const { pose } = b;
  const hipFront = b.at(...HIP.front);
  const hipRear = b.at(...HIP.rear);
  const front = b.sunk(pose.front);
  const rear = b.sunk(pose.rear);
  leg(b, hipRear, rear, FAR);
  tasset(b, b.at(-8, -23.5), b.at(-2, -23), hipRear, rear, FAR);
  tabard(b);
  leg(b, hipFront, front, NEAR);
  tasset(b, b.at(1, -23), b.at(8.5, -23.5), hipFront, front, NEAR);
}
