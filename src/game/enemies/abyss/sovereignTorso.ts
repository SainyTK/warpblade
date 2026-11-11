import type { Color } from "../../../types/color";
import { VOID } from "./colors";
import type { Pt } from "./paint";
import type { SovereignBody } from "./sovereignBody";
import { ARMOUR } from "./sovereignColors";

/** the chest's middle, where its ridge runs */
const CHEST_MID = 1.5;
/** the breastplate: a narrow belt, a chest that broadens to the shoulders, and a collar that dips to the ridge */
const BREAST: readonly Pt[] = [
  [-5.5, -22.5],
  [8, -22.5],
  [10, -28],
  [11.5, -34],
  [8.5, -38],
  [5, -38.6],
  [CHEST_MID, -36.8],
  [-2, -38.6],
  [-6, -38],
  [-9.5, -34],
  [-8, -28],
];
/** the half of the chest on the sun's side, between the ridge and the flank, drawn for a sun ahead of it */
const SUN_HALF: readonly Pt[] = [
  [CHEST_MID + 0.5, -36.5],
  [5, -38],
  [8.5, -37.4],
  [10.8, -33.8],
  [9.4, -28.5],
  [CHEST_MID + 0.5, -27.5],
];
/** the lower edge of the chest plate, a shallow V over the banded belly */
const CHEST_EDGE: readonly Pt[] = [
  [-8, -28.5],
  [CHEST_MID, -26.8],
  [10, -28.5],
];
/** the belt across the hips, over the top of the skirt of plates */
const BELT: readonly Pt[] = [
  [-6.5, -23.4],
  [8.8, -23.4],
  [9, -21.6],
  [-6.6, -21.6],
];
/** the banded plates over the belly, as heights across it */
const BANDS: readonly number[] = [-26, -24.6];
/** the engraved trim along the collar */
const TRIM: readonly (readonly [Pt, Pt])[] = [
  [
    [-8.5, -34.5],
    [-2.5, -37.6],
  ],
  [
    [5.5, -37.6],
    [10.5, -34.5],
  ],
];
/** the glowing cracks that split the plate once it is enraged, as jagged paths out from the slit in its chest */
const CRACKS: readonly (readonly Pt[])[] = [
  [
    [CHEST_MID, -32],
    [-1.5, -34],
    [-1, -35.6],
    [-4, -37.4],
  ],
  [
    [CHEST_MID, -31],
    [4.5, -29.8],
    [5.5, -27.5],
    [8.5, -25],
  ],
  [
    [-7, -32],
    [-5, -30],
    [-6, -27.4],
  ],
];
/** a pauldron: its top plate, the lame under it and the spike raking up off it, standing upright */
interface Pauldron {
  plate: readonly Pt[];
  lame: readonly Pt[];
  spike: readonly [Pt, Pt];
}
const PAULDRON: { front: Pauldron; rear: Pauldron } = {
  front: {
    plate: [
      [5, -38.6],
      [9, -41],
      [13.5, -40],
      [16, -36],
      [15, -32.5],
      [9.5, -33.8],
    ],
    lame: [
      [9.5, -34.5],
      [15.2, -33.4],
      [15.6, -30],
      [10.5, -30.8],
    ],
    spike: [
      [12, -40],
      [15.5, -46.5],
    ],
  },
  rear: {
    plate: [
      [-3, -38.6],
      [-7, -41],
      [-11.5, -40],
      [-14, -36],
      [-13, -32.5],
      [-7.5, -33.8],
    ],
    lame: [
      [-7.5, -34.5],
      [-13.2, -33.4],
      [-13.6, -30],
      [-8.5, -30.8],
    ],
    spike: [
      [-10, -40],
      [-13, -45.5],
    ],
  },
};
/** the slit of void light in the chest: its center, its half width at rest, when a blow gathers and enraged, and height */
const CORE = { at: [CHEST_MID, -31.5] as Pt, rest: 0.6, hot: 1.1, enraged: 1.6, tall: 2.6 } as const;

/** a jagged line of void light: a dark seam with a burning core and a white spot at each bend */
function crack(b: SovereignBody, path: readonly Pt[], pulse: number): void {
  for (let i = 1; i < path.length; i++) {
    const a = b.at(...path[i - 1]);
    const c = b.at(...path[i]);
    b.g.stroke(...a, ...c, 0.5, VOID[1]);
    b.g.hairline(...a, ...c, pulse > 0.5 ? VOID[4] : VOID[3]);
    b.g.set(...a, VOID[5]);
  }
}

/** the trim colour: dull wine at rest, woken to void light once it is enraged */
const trim = (b: SovereignBody): Color => (b.enraged ? VOID[2] : ARMOUR.trim);

/** the breastplate with its banded belly, a ridge down its middle, engraved trim and the slit of void light */
export function drawTorso(b: SovereignBody): void {
  const { g, pose, time } = b;
  const pulse = 0.5 + 0.5 * Math.sin(time * 3.1);
  const sunward = (x: number): number => (b.lit > 0 ? x : 2 * CHEST_MID - x);
  b.g.s.begin();
  g.poly(
    BREAST.map((p) => b.at(...p)),
    ARMOUR.base,
  );
  b.g.s.shadeEdges(ARMOUR.base, ARMOUR.light, ARMOUR.dark, 3);
  g.poly(
    SUN_HALF.map(([x, y]) => b.at(sunward(x), y)),
    ARMOUR.light,
  );
  g.poly(
    SUN_HALF.map(([x, y]) => b.at(2 * CHEST_MID - sunward(x), y)),
    ARMOUR.dark,
  );
  for (let i = 1; i < CHEST_EDGE.length; i++) {
    g.hairline(...b.at(...CHEST_EDGE[i - 1]), ...b.at(...CHEST_EDGE[i]), ARMOUR.deep);
    g.hairline(
      ...b.at(CHEST_EDGE[i - 1][0], CHEST_EDGE[i - 1][1] + 0.5),
      ...b.at(CHEST_EDGE[i][0], CHEST_EDGE[i][1] + 0.5),
      ARMOUR.dark,
    );
  }
  for (const y of BANDS) {
    g.hairline(...b.at(-5.5, y), ...b.at(8, y), ARMOUR.deep);
    g.hairline(...b.at(-5, y + 0.5), ...b.at(7.5, y + 0.5), ARMOUR.light);
  }
  // the ridge down the middle: a dark seam with a glint along its sunward side
  g.hairline(...b.at(CHEST_MID, -36.6), ...b.at(CHEST_MID, -27), ARMOUR.deep);
  g.hairline(...b.at(CHEST_MID + b.lit * 0.5, -36.4), ...b.at(CHEST_MID + b.lit * 0.5, -34), ARMOUR.glint);
  for (const [p, q] of TRIM) g.hairline(...b.at(...p), ...b.at(...q), trim(b));
  b.g.s.commit();
  // the belt, its buckle an eye of void light
  b.g.s.begin();
  g.poly(
    BELT.map((p) => b.at(...p)),
    ARMOUR.dark,
  );
  b.g.s.shadeEdges(ARMOUR.dark, ARMOUR.sheen, ARMOUR.deep);
  const [kx, ky] = b.at(CHEST_MID + 0.5, -22.5);
  g.dot(kx, ky, 1, ARMOUR.light);
  g.set(kx, ky, b.hot ? VOID[5] : VOID[3]);
  g.set(kx - 0.5, ky, VOID[2]);
  b.g.s.commit();
  // the slit of void light in its chest, opening wide as a blow gathers and once it is enraged
  const half = b.enraged ? CORE.enraged : CORE.rest + (CORE.hot - CORE.rest) * pose.heat;
  const [cx, cy] = b.at(...CORE.at);
  b.g.s.begin();
  g.poly(
    [
      [cx, cy - CORE.tall - 0.5],
      [cx + half + 0.5, cy],
      [cx, cy + CORE.tall + 0.5],
      [cx - half - 0.5, cy],
    ],
    VOID[1],
  );
  g.poly(
    [
      [cx, cy - CORE.tall],
      [cx + half, cy],
      [cx, cy + CORE.tall],
      [cx - half, cy],
    ],
    b.hot ? VOID[4] : VOID[3],
  );
  g.hairline(cx, cy - CORE.tall + 0.8, cx, cy + CORE.tall - 0.8, pulse > 0.4 || b.hot ? VOID[5] : VOID[4]);
  if (b.enraged) for (const path of CRACKS) crack(b, path, pulse);
  b.g.s.commit(false);
}

/** a pauldron: an angular top plate over a lame, a spike raking up off it, trim along its lower edge */
export function drawPauldron(b: SovereignBody, near: boolean): void {
  const { g } = b;
  const p = near ? PAULDRON.front : PAULDRON.rear;
  const base = near ? ARMOUR.base : ARMOUR.dark;
  const light = near ? ARMOUR.sheen : ARMOUR.light;
  const dark = near ? ARMOUR.dark : ARMOUR.deep;
  b.g.s.begin();
  g.taper(...b.at(...p.spike[0]), ...b.at(...p.spike[1]), 1.5, 0.25, base, near ? 0.5 : -0.5);
  g.poly(
    p.lame.map((q) => b.at(...q)),
    base,
  );
  b.g.s.shadeEdges(base, light, dark, 2);
  b.g.s.commit();
  b.g.s.begin();
  g.poly(
    p.plate.map((q) => b.at(...q)),
    base,
  );
  b.g.s.shadeEdges(base, light, dark, 2);
  // trim along the plate's lower edge, and a glint at its crest
  const low = p.plate.length - 1;
  g.hairline(...b.at(...p.plate[low - 1]), ...b.at(...p.plate[low]), trim(b));
  g.set(...b.at(...p.plate[1]), ARMOUR.glint);
  if (b.enraged && near) {
    const [x, y] = p.plate[2];
    g.hairline(...b.at(x, y + 1), ...b.at(x - 1, y + 4), VOID[4]);
    g.hairline(...b.at(x - 1, y + 4), ...b.at(x + 0.5, y + 6), VOID[3]);
  }
  b.g.s.commit();
}
