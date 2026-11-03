/** The stage window in art pixels, and where Kael's feet stand in it at the start of a motion. */
export const STAGE_W = 144;
export const STAGE_H = 88;
export const ORIGIN_X = 56;
export const ORIGIN_Y = 76;

/** Exported images are drawn this many times the game scale. */
export const EXPORT_SCALE = 4;

/** The game samples poses at 30 frames a second (ANIM_FPS) and steps the world at 60. */
export const WORLD_STEP = 1 / 60;

/** Stage colors: the game's night backdrop, a faint ground line and grid dots. */
export const STAGE_COLORS = {
  background: 0x0c0a18,
  ground: 0x2c2550,
  grid: 0x1d1838,
  origin: 0x3a3266,
} as const;

/** Onion skins of the neighbouring snapshots or frames. */
export const ONION = { before: 0xf0505a, after: 0x5ec8ef, amount: 0.65, alpha: 0.35 } as const;

/** Frames a new snapshot lands after the playhead when the playhead is already on a key. */
export const DEFAULT_SNAPSHOT_GAP = 3;
/** The timeline always shows at least this many frames past the last key or frame. */
export const TIMELINE_TAIL = 12;
