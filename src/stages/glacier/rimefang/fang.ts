import { fleck, glow, hairline, place, polygon } from "../../../engine/frame";
import type { ElementProjectile } from "../../../types/drill";
import { FOE } from "../foes/colors";

const C = FOE.crystal;
const FANG: readonly (readonly [number, number])[] = [
  [-5, -3.5],
  [-1, -4.5],
  [4, -2.5],
  [7, 1.5],
  [2, 0],
  [-3, 1],
  [-5.5, 0],
];

const turn = (points: readonly (readonly [number, number])[], a: number): [number, number][] => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return points.map(([x, y]) => [x * c - y * s, x * s + y * c]);
};

export function drawFang(bolt: ElementProjectile): void {
  const { x, y, face, distance } = bolt;
  const spin = distance * 0.22;
  place(x, y, face < 0);
  glow(0, 0, 15, C[2], 0.55);
  for (let i = 1; i <= 5; i++) {
    const back = -6 - i * 3.2;
    const sway = Math.sin(distance * 0.3 + i * 1.3) * (1 + i * 0.4);
    fleck(back, sway, i % 2 ? C[4] : C[3], 1 - i * 0.16);
    if (i < 4) hairline(back + 2, sway * 0.5, back - 1, sway, C[2], 0.6 - i * 0.12);
  }
  const shape = turn(FANG, spin);
  polygon(shape, C[1]);
  const core = turn(
    [
      [-3, -2.5],
      [3, -1.5],
      [5.5, 1],
      [1, -0.2],
    ],
    spin,
  );
  polygon(core, C[3]);
  hairline(shape[0][0], shape[0][1], shape[2][0], shape[2][1], C[4]);
  hairline(shape[2][0], shape[2][1], shape[3][0], shape[3][1], FOE.eyeHot);
  fleck(shape[3][0], shape[3][1], FOE.eyeHot);
  place();
}
