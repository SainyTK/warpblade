export type HallShape = "stack" | "hall" | "saw" | "dome" | "furnace";

export interface Hall {
  shape: HallShape;
  x0: number;
  x1: number;
  top: number;
}

export interface Stalactite {
  x: number;
  length: number;
  half: number;
}

export interface Fall {
  x: number;
  half: number;
  from: number;
}

const hall = (shape: HallShape, x0: number, x1: number, top: number): Hall => ({ shape, x0, x1, top });

export const STALACTITES: readonly Stalactite[] = [
  { x: 22, length: 22, half: 5 },
  { x: 48, length: 11, half: 3 },
  { x: 92, length: 30, half: 6 },
  { x: 119, length: 13, half: 3 },
  { x: 168, length: 19, half: 5 },
  { x: 206, length: 34, half: 7 },
  { x: 233, length: 11, half: 3 },
  { x: 282, length: 25, half: 6 },
  { x: 307, length: 14, half: 4 },
];

export const FALLS: readonly Fall[] = [
  { x: 66, half: 2.2, from: 0 },
  { x: 252, half: 3, from: 0 },
  { x: 141, half: 1.2, from: 0.5 },
];

export const FAR_HALLS: readonly Hall[] = [
  hall("stack", 8, 15, 58),
  hall("saw", 17, 56, 88),
  hall("stack", 40, 46, 46),
  hall("hall", 82, 130, 82),
  hall("stack", 100, 107, 36),
  hall("stack", 116, 122, 52),
  hall("dome", 150, 196, 70),
  hall("stack", 203, 211, 40),
  hall("saw", 214, 250, 86),
  hall("stack", 261, 268, 50),
  hall("hall", 274, 318, 90),
  hall("stack", 295, 301, 32),
];

export const NEAR_HALLS: readonly Hall[] = [
  hall("hall", -4, 40, 106),
  hall("stack", 58, 71, 78),
  hall("saw", 118, 168, 108),
  hall("furnace", 182, 232, 96),
  hall("hall", 248, 300, 104),
  hall("stack", 303, 316, 72),
];

export const BRIDGE = { y: 98, depth: 5, panel: 10 } as const;

export const CHIMNEY_TOPS: readonly (readonly [number, number])[] = [...FAR_HALLS, ...NEAR_HALLS]
  .filter((h) => h.shape === "stack")
  .map((h) => [(h.x0 + h.x1) / 2, h.top] as const);
