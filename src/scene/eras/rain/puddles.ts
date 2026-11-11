/** puddles along the floor, in art pixels: left edge and width */
export const PUDDLES: readonly (readonly [number, number])[] = [
  [8, 22],
  [62, 14],
  [118, 30],
  [176, 12],
  [214, 26],
  [268, 18],
  [300, 14],
];

/** whether a floor position lies in a puddle's open water */
export const inPuddle = (x: number): boolean => PUDDLES.some(([x0, w]) => x >= x0 + 2 && x <= x0 + w - 2);
