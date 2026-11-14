/** Honed Draw's ink cut: how far it runs, how fast, and half its height */
export const INK_CUT = { range: 70, speed: 320, half: 10 } as const;

/** seconds Shadow Step's mark lasts on a foe the dodge passed through */
export const STEP_MARK_TIME = 3;

/** Lingering Line's trail: half its height round the floor */
export const TRAIL = { half: 6 } as const;

/** Ink Horizon: the cut that runs on along the floor past where Brushline stops, its speed and half its height */
export const HORIZON = { speed: 360, half: 12 } as const;

/** Ink Stain ticks this often */
export const STAIN_EVERY = 0.5;

/** Weeping Cut: a foe dying bleeding passes its stacks to foes this close */
export const WEEP_SPREAD = 40;

/** Ink Crane: flight speed, turn rate, the distance it strikes from, and its life */
export const CRANE = { speed: 210, turn: 8, reach: 4, life: 2 } as const;

/** Ink Shade: how far from the foe it stands, the beat before it draws, between two draws, how long it shows, how far
 *  from her a foe may be, and how long its mark lasts */
export const SHADE_LOOK = { gap: 12, delay: 0.12, again: 0.16, life: 0.5, reach: 140, markTime: 3 } as const;

/** Paper Blades: their orbit round her, how fast they turn, how close they cut, and the flight of a blade let go */
export const PAPER = { radius: 18, wider: 26, spin: 4, reach: 6, flight: 260 } as const;
