import type { Enemy } from "../../../types/enemy";

export const SHEPHERD_HITS = { reap: 20, toll: 22, shard: 18 } as const;
export const SHEPHERD_TIMES = {
  reap: 0.65,
  again: 0.38,
  toll: 0.9,
  procession: 1.45,
  call: 0.6,
  moonfall: 0.85,
  swing: 0.3,
  tollHold: 0.45,
  callHold: 0.3,
  moonfallHold: 0.5,
  recover: 0.75,
  kneel: 1.6,
  rise: 0.4,
} as const;
export const SHEPHERD_WALK = { speed: 22, enraged: 30, stop: 16 } as const;
export const SHEPHERD_COOLDOWN = { least: 1.0, most: 1.7, enraged: 0.65 } as const;
export const REAP = { range: 46, high: 24, reach: 54, behind: 6, height: 18 } as const;
export const TOLL = { far: 180, radius: 18, height: 30, gap: 12, beat: 0.08 } as const;
export const MOONFALL = {
  near: 60,
  chance: 0.35,
  offsets: [0, -32, 32, -64, 64],
  beat: 0.12,
  mark: 0.55,
  half: 5,
} as const;
export const FLOCK = { every: 12, first: 6, most: 2, side: 70, edge: 20, xpShare: 0.25 } as const;
export const KNEEL = { at: 0.55, taken: 1.5 } as const;
export const SHEPHERD_DID = { reap: 1, toll: 2, call: 3, moonfall: 4 } as const;
export const AGAIN = 1;

/** the Toll's wind-up before wave scaling: the Procession of phase 2 gives longer to walk out of its wider band */
export const tollWindup = (e: Enemy): number => (e.phase === 2 ? SHEPHERD_TIMES.procession : SHEPHERD_TIMES.toll);

/** kneeling or rising: nothing knocks it down */
export const steadyShepherd = (e: Enemy): boolean => e.state === "burrow" || e.state === "hop";
