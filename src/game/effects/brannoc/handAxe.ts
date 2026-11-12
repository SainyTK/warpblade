import { BRANNOC_SKIN } from "../../../constants/characters/brannoc/look";
import { PAL } from "../../../constants/palette";
import { glow, hairline, line, polygon, px } from "../../../engine/frame";

const C = BRANNOC_SKIN.colors;
/** the haft's half length, and the head's reach past the haft and its width */
const HAFT = 4;
const HEAD = { out: 3, wide: 2.5 } as const;
/** spin angles of the crimson blur trailing behind the head */
const BLUR = [0.5, 1, 1.5] as const;

/**
 * His spinning hand axe at (x, y), turned `angle`: a dark haft through its middle, a steel head with a pale edge at one
 * end, and a crimson blur where the head has just been. The caller has placed the frame.
 */
export function drawHandAxe(x: number, y: number, angle: number, a = 1): void {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const at = (along: number, across: number): readonly [number, number] => [
    x + cos * along - sin * across,
    y + sin * along + cos * across,
  ];
  for (let i = 0; i < BLUR.length; i++) {
    const b = angle - BLUR[i];
    const bx = x + Math.cos(b) * (HAFT + 1);
    const by = y + Math.sin(b) * (HAFT + 1);
    px(bx - 0.5, by - 0.5, PAL.rage[3 - i], a * (0.7 - i * 0.2));
  }
  const [tx, ty] = at(-HAFT, 0);
  const [hx, hy] = at(HAFT, 0);
  line(tx - 0.5, ty - 0.5, hx - 0.5, hy - 0.5, C.hilt, a);
  const [e0x, e0y] = at(HAFT - 1, -HEAD.wide);
  const [e1x, e1y] = at(HAFT + HEAD.out, -HEAD.wide * 0.4);
  const [e2x, e2y] = at(HAFT + HEAD.out, HEAD.wide * 0.4);
  const [e3x, e3y] = at(HAFT - 1, HEAD.wide);
  polygon(
    [
      [e0x, e0y],
      [e1x, e1y],
      [e2x, e2y],
      [e3x, e3y],
    ],
    C.steel,
    a,
  );
  line(hx - 0.5, hy - 0.5, e1x - 0.5, e1y - 0.5, C.steelLight, a);
  hairline(e1x, e1y, e2x, e2y, C.bladeEdge, a);
  hairline(e0x, e0y, e1x, e1y, C.steelGlint, a);
  hairline(e3x, e3y, e2x, e2y, C.steelDark, a);
  glow(x, y, 7, PAL.rage[3], 0.2 * a);
}
