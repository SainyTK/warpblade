/** Rust Shards: stacks tick this often; Living Fortress without Rust Shards lays this spec */
export const RUST = {
  every: 0.5,
  /** fallback for Living Fortress's spray when Rust Shards is not held: damage per stack a second, seconds, most stacks */
  fortress: { damage: 0.1, duration: 4, max: 3, radius: 40 },
  /** a rusted foe this close softens the blows she takes */
  weakenReach: 40,
  /** Rust Reckoning consumes rust on foes within this many pixels */
  reckonReach: 60,
  /** each rusted foe sheds a fleck about this often */
  fleck: 0.25,
} as const;

/** Iron Hide: foes within this many pixels are knocked down by a broken plate, and keep a plate regrowing */
export const HIDE = { knock: 24, knockStun: 0.6, knockKx: 90, near: 80 } as const;
