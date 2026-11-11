import { cb, cg, cr, mix, WHITE } from "../../../utils/color";
import { AC, VOID } from "./colors";
import type { SovereignBody } from "./sovereignBody";
import { DARK_BELOW } from "./sovereignLight";

/** the rift's half width when fully open, and its half width as it first splits */
const SPAN = { open: 17, split: 3 } as const;
/** the rift's rows from far to near, as a height in art pixels and the share of its half width each spans */
const LENS: readonly (readonly [number, number])[] = [
  [-1.5, 0.6],
  [-1, 0.86],
  [-0.5, 1],
  [0, 0.94],
  [0.5, 0.7],
];
/** the shafts of void light that stand up out of the rift: x as a share of its half width, and their height */
const SHAFTS: readonly (readonly [number, number])[] = [
  [-0.7, 5],
  [-0.35, 9],
  [0, 13],
  [0.3, 8],
  [0.65, 6],
];

/**
 * The rift the Sovereign sinks into and rises from: a tear in the floor seen edge on, black inside with a burning
 * crimson lip, shafts of void light standing up out of it and flickering. It splits open as the sinking starts and
 * seals as the rising ends.
 */
/** how many art pixels above the floor the rift's light reaches up the body, and how strongly at the floor */
const UNDERLIGHT = { reach: 5, most: 0.55 } as const;

/** the rift's light on the dark parts of the body just above the floor, strongest at the floor and gone above reach */
function underlight(b: SovereignBody): void {
  const s = b.g.s;
  const { w, d, box } = s;
  const floor = s.oy;
  const top = Math.max(box.y0, floor - UNDERLIGHT.reach * s.res);
  for (let y = top; y < floor; y++) {
    const k = ((y - top + 1) / (floor - top)) * UNDERLIGHT.most * b.pose.rift;
    for (let x = box.x0, i = y * w + box.x0; x <= box.x1; x++, i++) {
      const c = d[i];
      if (c && cr(c) + cg(c) + cb(c) < DARK_BELOW) d[i] = mix(c, VOID[3], k);
    }
  }
}

export function drawRift(b: SovereignBody): void {
  const { g, pose, time } = b;
  if (pose.rift <= 0) return;
  const half = SPAN.split + (SPAN.open - SPAN.split) * pose.rift;
  underlight(b);
  b.g.s.begin();
  // the shafts first, so the lip lies over their feet
  SHAFTS.forEach(([share, tall], i) => {
    const x = share * half;
    const h = tall * pose.rift * (0.75 + 0.25 * Math.sin(time * 11 + i * 1.9));
    for (let y = 0; y < h; y += 0.5) {
      // the shaft thins out toward its top, one image pixel in two and then one in four
      const up = y / h;
      if (up > 0.5 && Math.floor(y * 2) % (up > 0.8 ? 4 : 2) !== 0) continue;
      g.set(x, -1.5 - y, up < 0.2 ? VOID[3] : up < 0.55 ? VOID[2] : VOID[1]);
    }
  });
  LENS.forEach(([y, share], row) => {
    const reach = Math.max(1, half * share);
    const lip = row === LENS.length - 1 || row === 0 ? VOID[3] : VOID[4];
    g.hairline(-reach, y, reach, y, lip);
    if (row > 0 && row < LENS.length - 1 && reach > 1.5) g.hairline(-reach + 1, y, reach - 1, y, AC.outline);
  });
  // the hot seam at the rift's heart, flickering white
  const seam = half * 0.5;
  g.hairline(-seam, -0.5, seam, -0.5, Math.sin(time * 19) > 0 ? VOID[5] : VOID[4]);
  g.set(0, -0.5, WHITE);
  b.g.s.commit(false);
}
