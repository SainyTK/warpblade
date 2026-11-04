import { EMBER } from "../../constants/characters/ysra/look";
import { circle, glow, line, place, polygon, px } from "../../engine/frame";
import { WHITE } from "../../utils/color";

type Pt = [number, number];
/** feathers along each wing's trailing edge */
const FEATHERS = 5;

/** a bird of forge-fire at (x, y) flying along (ux, uy): wings curved back and beating, a bright head, three long tail
 *  plumes; open from 0 (wings folded) to 1 (spread), beat is the flap's phase */
export function drawPhoenix(x: number, y: number, ux: number, uy: number, open: number, beat: number): void {
  place();
  const nx = -uy;
  const ny = ux;
  // a point `along` the flight and `across` it, and the same pushed out from the middle for the dark rim
  const at = (along: number, across: number, grow = 1): Pt => [
    x + (ux * along + nx * across) * grow,
    y + (uy * along + ny * across) * grow,
  ];
  glow(x, y, 40, EMBER[3], 0.4);
  // the tail: three plumes swaying behind
  for (const s of [-1, 0, 1]) {
    const sway = Math.sin(beat * 0.5 + s * 1.3) * 2.5;
    const len = s === 0 ? 34 : 28;
    const plume = (w: number, grow: number) =>
      polygon(
        [
          at(-8, s * 1.5 - w, grow),
          at(-8 - len * 0.5, s * 6 + sway * 0.5 - w * 0.8, grow),
          at(-8 - len, s * 9 + sway, grow),
          at(-8 - len * 0.5, s * 6 + sway * 0.5 + w * 0.8, grow),
          at(-8, s * 1.5 + w, grow),
        ],
        grow > 1 ? EMBER[1] : EMBER[3],
      );
    plume(2, 1.05);
    plume(1.6, 1);
    line(...at(-9, s * 1.5), ...at(-6 - len * 0.6, s * 6 + sway * 0.6), EMBER[5]);
    circle(...at(-8 - len, s * 9 + sway), 1.6, EMBER[4]);
  }
  // the wings: a curved leading edge out to the tip, a scalloped trailing edge of feathers back to the body
  const flap = Math.sin(beat);
  for (const side of [-1, 1]) {
    const span = (12 + 14 * open) * (0.9 + 0.1 * flap);
    const sweep = -10 - 6 * (1 - open) - 3 * flap;
    const wing: Pt[] = [];
    for (let k = 0; k <= 6; k++) {
      const u = k / 6;
      wing.push([3 - u * u * (3 - sweep), side * (2 + span * Math.sin((u * Math.PI) / 2))]);
    }
    for (let f = 1; f <= FEATHERS; f++) {
      const u = f / FEATHERS;
      const along = sweep + (-8 - sweep) * u;
      const across = side * (2 + span * (1 - u));
      wing.push([along - 4 * (1 - u * 0.5), across - side * 1.5]);
      wing.push([along, across - side * (span / FEATHERS) * 0.9]);
    }
    polygon(
      wing.map(([a, c]) => at(a, c, 1.07)),
      EMBER[1],
    );
    polygon(
      wing.map(([a, c]) => at(a, c)),
      EMBER[3],
    );
    polygon(
      wing.slice(0, 5).map(([a, c]) => at(a * 0.8 - 1, c * 0.75)),
      EMBER[4],
    );
    const [ta, tc] = wing[6];
    line(...at(3, side * 2), ...at(ta + 2, tc * 0.85), EMBER[5]);
    px(...at(ta, tc), EMBER[6]);
  }
  // the body: a bright teardrop, the head on its point, a white beak
  polygon([at(-10, 0, 1.08), at(0, 3.6, 1.08), at(6, 0, 1.08), at(0, -3.6, 1.08)], EMBER[1]);
  polygon([at(-10, 0), at(0, 3.2), at(6, 0), at(0, -3.2)], EMBER[4]);
  circle(...at(6, 0), 2.6, EMBER[5]);
  line(...at(-6, 0), ...at(5, 0), EMBER[6]);
  line(...at(8, 0), ...at(10, 0), WHITE);
  glow(...at(5, 0), 10, EMBER[5], 0.5);
}
