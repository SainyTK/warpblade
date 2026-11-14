/** Hot Gale: a cone of hot wind ahead, `reach` long and `spread` high at its end, pushing foes back */
export const GALE = { reach: 60, spread: 30, push: 220, life: 0.35 } as const;
/** Glass Rain: shards of fused sand fall on points ahead of him, from this high, hitting this wide */
export const GLASS = { from: 20, to: 90, height: 90, fall: 300, reach: 10, gap: 0.07 } as const;
/** Quicksand: a pit on the floor ahead, this far out and this wide, pulling foes to its middle and cutting them often */
export const QUICKSAND = { ahead: 34, reach: 26, pull: 60, every: 0.4 } as const;
