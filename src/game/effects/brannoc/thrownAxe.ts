import { BRANNOC_SKIN } from "../../../constants/characters/brannoc/look";
import { PAL } from "../../../constants/palette";
import { fleck, glow, hairline, line, polygon } from "../../../engine/frame";

const C = BRANNOC_SKIN.colors;
/** turns a second the great axe spins end over end in flight, and how much bigger its head is drawn than the held one's,
 *  so it reads in flight */
const SPIN = 3.2;
const HEAD_SCALE = 1.35;
/** the haft from the butt to the top, measured from the point it spins round (just under the head) */
const HAFT = { butt: -15, top: 3 } as const;
/** the bearded head's outline, along and across the haft from the spin point, top of the eye round the edge to the beard */
const HEAD: readonly (readonly [number, number])[] = [
  [2.8, 0.4],
  [3.6, 2.4],
  [3.1, 4.8],
  [0.8, 5.4],
  [-1.6, 5.2],
  [-3.4, 4.8],
  [-2.4, 3],
  [-1.2, 1.6],
  [-1, 0.4],
];
/** the pale edge along the head's far side, top to beard */
const EDGE: readonly (readonly [number, number])[] = [
  [3.2, 3.3],
  [2.6, 4.6],
  [0.8, 5],
  [-1.6, 4.8],
  [-3, 4.5],
];
/** the back spike opposite the edge, and the bone cord bound round the haft */
const SPIKE: readonly (readonly [number, number])[] = [
  [1.8, -0.6],
  [1, -2.4],
  [0.2, -0.6],
];
const BINDINGS = [-9.5, -13.5] as const;
/** angles behind the head where its crimson blur trails, and how strong each is */
const BLUR = [0.35, 0.7, 1.05] as const;

/**
 * Brannoc's great axe hurled for his warp, spinning end over end round the head toward its foe (`angle` is its flight)
 * with the edge leading: the dark ash haft, the bone cord, the bearded iron head with its pale edge, and a crimson blur
 * where the head has just been. The caller has placed the frame.
 */
export function drawThrownAxe(x: number, y: number, angle: number, t: number): void {
  // it turns forward over its top in whichever way it flies
  const way = Math.cos(angle) < 0 ? -1 : 1;
  const turn = angle + way * t * SPIN * Math.PI * 2;
  const ca = Math.cos(turn);
  const sn = Math.sin(turn);
  const at = (d: number, w: number): [number, number] => [x + ca * d - sn * w * way, y + sn * d + ca * w * way];
  const head = (d: number, w: number): [number, number] => at(d * HEAD_SCALE, w * HEAD_SCALE);
  for (let i = 0; i < BLUR.length; i++) {
    const back = turn - way * BLUR[i];
    const bx = x + Math.cos(back) * 5;
    const by = y + Math.sin(back) * 5;
    glow(bx, by, 4, PAL.rage[3 - i], 0.3 - i * 0.08);
  }
  const [b0x, b0y] = at(HAFT.butt, 0);
  const [b1x, b1y] = at(HAFT.top, 0);
  line(b0x, b0y, b1x, b1y, C.hilt);
  hairline(...at(HAFT.butt, 0.4), ...at(HAFT.top, 0.4), C.gloveLight);
  for (const d of BINDINGS) {
    fleck(...at(d, 0), C.scarf);
    fleck(...at(d - 0.6, 0.4), C.scarfDark);
  }
  fleck(b0x, b0y, C.steelDark);
  polygon(
    HEAD.map(([d, w]) => head(d, w)),
    C.blade,
  );
  polygon(
    SPIKE.map(([d, w]) => head(d, w)),
    C.bladeBack,
  );
  hairline(...head(-1, 0.9), ...head(2.8, 0.9), C.bladeDeep);
  hairline(...head(-2.2, 2.6), ...head(2.4, 2.6), C.steelLight);
  for (let i = 1; i < EDGE.length; i++) {
    const [a0, a1] = EDGE[i - 1];
    const [c0, c1] = EDGE[i];
    hairline(...head(a0, a1), ...head(c0, c1), i === 1 ? PAL.rage[5] : C.bladeEdge);
  }
  fleck(...head(3.1, 4.4), C.steelGlint);
}
