/** the spells his skills teach, the numbers their skills' rows leave out */
export const SPELLS = {
  /** Dawn Lance's wide fan climbs this much per pixel, a volley's lances fly this far apart, a burst at the end of a
   *  lance deals this share of its blow, and Spear of Morning's lance is this much bigger */
  lanceFan: [-0.18, 0, 0.18],
  lanceGap: 10,
  burstShare: 0.5,
  spearSize: 2,
  /** Mending Light held heals and reaches this much more; its barrier lasts this long; healing over time lasts this long */
  mendWide: 1.5,
  mendBarrier: 3,
  regenTime: 3,
  /** Absolution: the Penance stacks the ring of an evolved Mending Light lays on each foe, each tick `tick` ability power a stack */
  absolution: { stacks: 3, max: 8, tick: 0.25, every: 0.5, duration: 4 },
  /** Rallying Cry held reaches this much more; its quicker blows last this long */
  rallyWide: 1.5,
  rallyTime: 4,
} as const;
