import { VOID } from "./colors";
import type { Pt } from "./paint";
import type { SovereignBody } from "./sovereignBody";
import { MANTLE } from "./sovereignColors";

/** where the mantle hangs from, across the back of the shoulders, far side first */
const COLLAR: readonly Pt[] = [
  [-12, -37],
  [10.5, -37],
];
/** the far edge of the mantle as it falls from the shoulder and flares out behind the body */
const FALL: readonly Pt[] = [
  [-14.5, -30],
  [-17.5, -17],
];
/** the ragged hem, back to front: x at the floor and how high above it each tatter ends */
const HEM: readonly Pt[] = [
  [-21, 4.5],
  [-17.5, 2],
  [-13.5, 3.8],
  [-9.5, 1.4],
  [-5, 3],
  [-1, 1.6],
  [3, 3.2],
  [7, 2.4],
  [10.5, 4.5],
];
/** how far the hem sways at rest, and how far it lifts and streams back when billowing */
const SWAY = { rest: 1.1, liftY: 7, liftX: 4 } as const;

/**
 * The great mantle behind the body: heavy wine-dark cloth from the shoulders to a tattered hem just off the floor,
 * flaring out behind it, its folds catching the light and its crimson lining showing at the far edge. The hem sways
 * with its breath and its stride and billows up when it swings or rises from the rift. Enraged, the tatters smoulder.
 */
export function drawMantle(b: SovereignBody): void {
  const { g, pose, time } = b;
  const floor = pose.sink;
  const hem = HEM.map(([x, up], i): Pt => {
    const sway = Math.sin(time * 2.3 + i * 1.1) * SWAY.rest;
    const lift = pose.billow * SWAY.liftY * (0.5 + (i % 3) * 0.25);
    return [x + pose.shift * 0.6 + sway - pose.billow * SWAY.liftX, floor - up - lift];
  });
  const outline: Pt[] = [b.at(...COLLAR[0]), ...FALL.map((p) => b.at(...p))];
  for (const p of hem) outline.push(p);
  outline.push(b.at(12, -26), b.at(...COLLAR[1]));
  b.g.s.begin();
  g.poly(outline, MANTLE.base);
  b.g.s.shadeEdges(MANTLE.base, MANTLE.fold, MANTLE.deep, 3);
  // folds running down from the shoulders to every other tatter, the lining showing in the deep ones
  for (let i = 1; i < hem.length - 1; i += 2) {
    const top = b.at(-11 + i * 2.6, -32);
    g.hairline(...top, hem[i][0], hem[i][1] - 1, i % 4 === 1 ? MANTLE.dark : MANTLE.fold);
  }
  // the lining along the far edge, where the cloth turns
  const edge = [b.at(...COLLAR[0]), ...FALL.map((p) => b.at(...p)), hem[0]];
  for (let i = 1; i < edge.length; i++)
    g.hairline(edge[i - 1][0] + 0.5, edge[i - 1][1], edge[i][0] + 0.5, edge[i][1] - 0.5, MANTLE.lining);
  if (b.enraged)
    hem.forEach(([x, y], i) => {
      const flicker = Math.sin(time * 9 + i * 2.1) > 0;
      g.set(x, y - 0.5, flicker ? VOID[4] : VOID[3]);
      g.set(x + 0.5, y - 1, VOID[2]);
    });
  b.g.s.commit();
}
