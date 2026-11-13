import { HERO_COLORS as HC, PAL } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Vec } from "./reach";

/** a point d along the haft from the near hand and w across it, toward the side the edge is on */
type Along = (d: number, w: number) => Vec;

/** the haft from the butt to the top, and where the bone cord binds it: at the near hand and at the lower grip */
const HAFT = { butt: -7.5, top: 17, width: 0.5 } as const;
const BINDINGS = [
  [-1.4, 1.4],
  [-6.6, -4.6],
] as const;
/** the bearded head's outline, along and across the haft, from the top of the eye round the edge to the beard's hook */
const HEAD: readonly Vec[] = [
  [16.8, 0.5],
  [17.7, 2.6],
  [17.2, 5.3],
  [14.6, 5.9],
  [12, 5.8],
  [9.8, 5.4],
  [10.8, 3.4],
  [12.2, 1.9],
  [12.4, 0.5],
];
/** the pale edge along the head's far side, top to beard */
const EDGE: readonly Vec[] = [
  [17.3, 3.6],
  [16.7, 5],
  [14.6, 5.4],
  [12, 5.3],
  [10.4, 5],
];
/** the iron eye round the haft, and the back spike opposite the edge */
const EYE = { from: 12.2, to: 17, w: 1.3 } as const;
const SPIKE: readonly Vec[] = [
  [15.6, -0.6],
  [14.8, -2.6],
  [14, -0.6],
];

/** what the kit asks of the axe this frame: the edge glinting crimson after a blow lands */
export const axeLook = { glint: false };

/**
 * Brannoc's great axe in both hands: a long dark ash haft with a lit edge and an iron butt cap, bound in bone cord at
 * both grips; at its top a wide bearded iron head with a dark back spike, a pale edge, and a crimson glint along that
 * edge for a moment after each blow lands. `flip` turns the head to the other side of the haft (pose key `ah`).
 */
export function drawGreatAxe(s: SpriteCanvas, hand: Vec, angle: number, flip: boolean): void {
  const ca = Math.cos(angle);
  const sn = Math.sin(angle);
  const side = flip ? -1 : 1;
  const at: Along = (d, w) => [hand[0] + ca * d - sn * w * side, hand[1] + sn * d + ca * w * side];
  const [b0, b1] = [at(HAFT.butt, 0), at(HAFT.top, 0)];
  s.begin();
  s.stroke(b0[0], b0[1], b1[0], b1[1], HAFT.width, HC.hilt);
  s.shadeEdges(HC.hilt, HC.gloveLight, HC.outline);
  s.commit();
  s.begin();
  for (const [from, to] of BINDINGS) {
    for (let d = from; d <= to; d += 0.9) {
      const c = at(d, 0);
      s.set(c[0], c[1], Math.round(d * 1.1) % 2 === 0 ? HC.scarf : HC.scarfDark);
    }
  }
  s.commit(false);
  s.begin();
  s.dot(b0[0], b0[1], 0.7, HC.steelDark);
  s.shadeEdges(HC.steelDark, HC.steel, HC.steelDeep);
  s.commit();
  s.begin();
  s.poly(
    HEAD.map(([d, w]) => at(d, w)),
    HC.blade,
  );
  s.poly(
    SPIKE.map(([d, w]) => at(d, w)),
    HC.bladeBack,
  );
  s.shadeEdges(HC.blade, HC.steelLight, HC.bladeDeep, 2);
  s.commit();
  s.begin();
  const [e0, e1] = [at(EYE.from, 0), at(EYE.to, 0)];
  s.stroke(e0[0], e0[1], e1[0], e1[1], EYE.w, HC.bladeBack);
  s.shadeEdges(HC.bladeBack, HC.blade, HC.bladeDeep);
  s.commit();
  s.begin();
  for (let i = 1; i < EDGE.length; i++) {
    const a = at(EDGE[i - 1][0], EDGE[i - 1][1]);
    const b = at(EDGE[i][0], EDGE[i][1]);
    s.hairline(a[0], a[1], b[0], b[1], axeLook.glint ? PAL.rage[4] : HC.bladeEdge);
  }
  const tip = at(17.2, 4.4);
  s.set(tip[0], tip[1], axeLook.glint ? PAL.rage[5] : HC.steelGlint);
  s.commit(false);
}
