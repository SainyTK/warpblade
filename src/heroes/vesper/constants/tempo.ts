/**
 * Tempo, Vesper's meter: every blow of hers that lands adds a stack, each stack makes her string and her walk faster, and
 * the stacks fall away once she stops landing blows. At the top her short blade adds echo cuts.
 */
export const TEMPO = {
  /** the most stacks */
  most: 10,
  /** seconds after her last blow landed before Tempo starts to fall, and the seconds between each stack lost after */
  hold: 1.3,
  fallEvery: 0.3,
  /** each stack plays her moves this much faster */
  speed: 0.03,
  /** each stack makes her walk this much faster */
  walk: 0.015,
  /** a Keen move that lands adds this many more stacks: her timing reward */
  keen: 1,
  /** a warp arrival and a parry add this many */
  warp: 2,
  parry: 3,
  /** a blow taken costs this share of the stacks */
  hurt: 0.5,
} as const;

/** at the top of Tempo each short-blade blow that lands sends an echo cut at its foe, this many times attack damage */
export const ECHO = { power: 0.35, delay: 0.07 } as const;
