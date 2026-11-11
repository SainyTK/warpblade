export interface CrystalRowLook {
  /** how far the row runs to each side, and the seconds its front takes to get there */
  reach: number;
  grow: number;
  /** the first crystal's distance from the middle and the gap between crystals */
  start: number;
  gap: number;
  /** crystal heights: the tallest stand at the middle, the shortest at the row's ends */
  tall: number;
  short: number;
  /** seconds a crystal stands, then the seconds it takes to sink and break up */
  stand: number;
  sink: number;
}

/** the crystals Crystal Burst throws up around Kael */
export const BURST_CRYSTALS = {
  start: 12,
  gap: 11,
  tall: 11,
  short: 6,
  stand: 0.25,
  sink: 0.25,
} as const satisfies Omit<CrystalRowLook, "reach" | "grow">;

/** the crystals Crystal Nova throws up along the floor under its ring, by ultimate level */
export const NOVA_CRYSTALS = [
  { start: 12, gap: 13, tall: 16, short: 7, stand: 0.3, sink: 0.3 },
  { start: 12, gap: 13, tall: 20, short: 7, stand: 0.35, sink: 0.3 },
  { start: 12, gap: 14, tall: 24, short: 8, stand: 0.4, sink: 0.35 },
  { start: 12, gap: 15, tall: 30, short: 9, stand: 0.5, sink: 0.4 },
] as const satisfies readonly Omit<CrystalRowLook, "reach" | "grow">[];

/** Crystal Nova's ring: the white front, the bands behind it in art pixels, and the dashes of its wake */
export const NOVA_RING = { bands: [0.5, 1, 1.5], wake: [3.5, 6], squash: 0.62, farStrength: 0.55 } as const;

/** Crystal Lance's crescent: its bow forward, its thickness at the middle and at the tips, and its tail of streaks */
export const LANCE_LOOK = { bow: 5, thick: 3, thin: 0.6, tail: 12, streaks: 5 } as const;
