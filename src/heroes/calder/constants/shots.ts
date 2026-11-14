import { hex } from "../../../utils/color";
import type { CalderAbility } from "../types/ability";

/** Calder's abilities in the order O turns through them: his two shots, then his spell skills' shells */
export const CALDER_ABILITIES: readonly CalderAbility[] = ["slug", "scatter", "flare", "chain", "charge"];

/** the shots paid in rounds: rounds for the plain and the wide form */
export const SHOT_ROUNDS = { slug: [1, 2], scatter: [2, 3] } as const;

/** seconds each base shot takes to come back */
export const SHOT_RECHARGE = { slug: 3.5, scatter: 5 } as const;

/** Slug Shot: a heavy round straight ahead that pierces every foe in its line; Breaker Slug, held, also breaks guards and
 *  drives foes back */
export const SLUG = { power: 2.4, speed: 420, life: 0.75, half: 5, kx: 40, wide: 1.3, wideKx: 220 } as const;

/** Scatter Blast: pellets in a cone ahead, each foe in reach struck once, and a hop back from the recoil; Twin Scatter,
 *  held, fires fore and back and keeps Calder planted */
export const SCATTER = {
  power: 2,
  reach: 46,
  height: 30,
  kx: 180,
  ky: -90,
  hop: 120,
  hopRise: 10,
  pellets: 14,
} as const;

/** the moment in a shot clip the round leaves the barrel (frame 5), and the moment Twin Scatter fires behind (frame 10) */
export const SHOT_FIRE = 5 / 30;
export const SHOT_FIRE_BACK = 10 / 30;

/** each ability's colour: its tab, its touch rim and its round's light */
export const ABILITY_COLOR: Readonly<Record<CalderAbility, ReturnType<typeof hex>>> = {
  slug: hex("#b4ff5a"),
  scatter: hex("#ffe066"),
  flare: hex("#7dffb0"),
  chain: hex("#c8d4e0"),
  charge: hex("#ff9a4a"),
};

/** a shell's wide form costs this many times its MP */
export const WIDE_COST = 1.5;

/** Phosphor Shell: a lobbed shell that bursts and leaves a pool of green fire; held, three shells spread out */
export const FLARE = {
  vx: 150,
  vy: -130,
  gravity: 520,
  burnEvery: 0.5,
  burnLast: 1.5,
  burnMax: 5,
  spread: 45,
} as const;
/** Chain Shot: two weights on a chain spinning forward through every foe in its line; held, it flies out and back */
export const CHAIN = { speed: 300, life: 0.55, half: 9, drag: 160 } as const;
/** Blast Charge: thrown onto the floor ahead, it blows when a foe touches it or its fuse runs out; held, three in a row */
export const CHARGE = { throw: 40, gap: 26, touch: 9, pull: 150 } as const;
