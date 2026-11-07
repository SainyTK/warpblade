import { ramp } from "../../utils/color";

/** iron rust on a foe the hook bit: deep brown to a pale orange flake */
export const IRON_RUST = ramp(["#2a140c", "#5a2a14", "#8e4a1e", "#c4702a", "#e8a050", "#f8d8a8"]);

/** Rust Bite: seconds between ticks, how near a foe must stand to catch spreading rust and how often it spreads, the
 *  slow on rusted foes, Corrode's burst reach, and how often a rusted foe sheds a fleck */
export const RUST_BITE = {
  tick: 0.5,
  spreadReach: 14,
  spreadEvery: 1,
  /** a foe given rust by a spread cannot pass it on again this soon */
  spreadGuard: 0.5,
  chill: 0.2,
  corrodeReach: 40,
  fleck: 0.25,
} as const;

/** Friction Burn: how near a foe must stand to catch the burn of a burning foe that falls; Scorched Arc's flames in the
 *  air, laid every `drop` seconds of a swing, lasting `life`, hurting foes within `reach` once every `every` seconds */
export const FRICTION = {
  spreadReach: 40,
  scorch: { drop: 0.02, life: 1.4, reach: 8, every: 0.5 },
} as const;

/** Pendulum Kick: an afterimage kicks again this long after a kick at this share of top swing speed or faster; Comet
 *  Heel's trail is laid for `lay` seconds after a kick, lasts `life`, and burns foes within `reach` for `power` times
 *  attack damage once every `every` seconds, setting them alight for `burn` */
export const KICK_ECHO = { delay: 0.2, topShare: 0.9, ghost: 0.3 } as const;
export const COMET = { lay: 0.35, drop: 0.015, life: 1.2, reach: 9, every: 0.5, power: 0.35, burn: 2 } as const;
