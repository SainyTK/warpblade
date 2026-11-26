/** The stage window in art pixels, and where the hero's feet stand in it. */
export const STAGE_W = 144;
export const STAGE_H = 88;
export const ORIGIN_X = 56;
export const ORIGIN_Y = 76;

/** The game samples poses at 30 frames a second (ANIM_FPS) and steps the world at 60. */
export const WORLD_STEP = 1 / 60;

/** Stage colors: the game's night backdrop, a faint ground line and grid dots. */
export const STAGE_COLORS = {
  background: 0x0c0a18,
  ground: 0x2c2550,
  grid: 0x1d1838,
  origin: 0x3a3266,
} as const;

/** Onion skins of the frames before (red) and after (blue). */
export const ONION = { before: 0xf0505a, after: 0x5ec8ef, amount: 0.65, alpha: 0.35 } as const;

/** Thumbnails show this much around the hero's feet, in art pixels, drawn this many screen pixels to an art pixel. */
export const THUMB = { w: 56, h: 66, above: 58, scale: 2 } as const;

/** Edits are saved this long after the last change. */
export const SAVE_DELAY_MS = 600;
