import { hero } from "../../../game/state";
import type { HeroState } from "../../../types/hero";

/** the states in which Saya's katana is out of the scabbard: a blow, the warp's throw and arrival, her own states */
const DRAWN_STATES: ReadonlySet<HeroState> = new Set([
  "move",
  "throw",
  "throwWait",
  "warpStrike",
  "counter",
  "line",
  "rise",
  "moon",
  "ultimate",
  "cast",
]);

/** her katana is out of the scabbard right now */
export const bladeOut = (): boolean => DRAWN_STATES.has(hero.state);
