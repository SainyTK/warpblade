/** Crystal Nova, Kael's ultimate, and what its skill (`k_nova`) adds to it */

/** how far the ring runs at each charge level; level 4 crosses the whole screen */
export const NOVA_RADIUS = [60, 100, 150, 340] as const;
/** the special is the weakest ultimate: its ring deals this share of a charge level's power */
export const NOVA_SHARE = 0.75;
/** seconds the ring takes to reach its edge, and the seconds it fades after */
export const NOVA_TIME = { grow: 0.4, fade: 0.25 } as const;
/** the plain ring throws foes out and up; drawn in, they are pulled toward Kael and thrown up */
export const NOVA_KNOCK = { out: 140, pull: -70, launch: -170 } as const;
/** an echo ring starts this long after the one before it and reaches this much farther */
export const NOVA_ECHO = { delay: 0.32, grow: 1.35 } as const;
/** the phantoms: three cuts each, this far apart, and how long a phantom stays in view */
export const NOVA_PHANTOM = { cuts: 3, gap: 0.11, first: 0.08, life: 0.55 } as const;
/** the crystal stars: when they start to fall after the ring, the gap between them, at most this many, and their reach */
export const NOVA_STARS = { start: 0.15, gap: 0.06, most: 24, reach: 14, speed: 360 } as const;
/** a star's look: the length of its tail in seconds of flight and the size of its head */
export const STAR_LOOK = { tail: 0.08, head: 2.2 } as const;
/** the storm of edges: the seconds it takes to cut every struck foe, after the ring */
export const NOVA_EDGES = { start: 0.2, span: 0.6 } as const;
/** Supernova's storm round Kael: it cuts every foe this close, this often, each cut this share of the ring's blow */
export const NOVA_FOLLOW = { reach: 70, every: 0.2, share: 0.2 } as const;
