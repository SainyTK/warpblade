import type { HitFeel } from "../types/move";
import { ramp } from "../utils/color";
import { frame } from "./hero";

/** a foe counts as level with the hero when its box reaches this far above or below the feet, in pixels */
export const REACH = { above: 44, below: 6 } as const;

/** travelling moves stop this close to the foe in front, and go this much further while forward is held */
export const ADVANCE = { contact: 6, lean: 1.5 } as const;

/** air attacks Kael may make before he lands: the wheel and the scissor cut, plus the stomp with Sky Dance (its `air` value) */
export const AIR_STRING = { hits: 2, skill: "k_skydance" } as const;

/** a blow is dealt this many seconds before its `at`, so the strike shows on the clip key the hit lands on */
export const STRIKE_LEAD = 0.025;
/** the `at` of a blow dealt on this animation frame of its clip, where the clip snaps to the strike */
export const onFrame = (n: number): number => frame(n) + STRIKE_LEAD;

/** Keen timing: J pressed this soon after a blow lands makes the next move a sure crit */
export const KEEN = { window: 0.1 } as const;
/** gold slash for a Keen blow */
export const KEEN_RAMP = ramp(["#3a1c08", "#7a3a10", "#c46a1a", "#f2a73a", "#ffd76b", "#fff3c0", "#ffffff"]);
/** the slash of a phantom move, for pivots and passes through a foe */
export const PHANTOM_RAMP = ramp(["#1a0e2e", "#3a1e66", "#6a3cb0", "#9a6ae8", "#c9a8ff", "#efe2ff", "#ffffff"]);
/** the slash of a quick stab */
export const STAB_RAMP = ramp(["#122046", "#2b4fb0", "#5a86f0", "#93b6ff", "#cfe0ff", "#f2f7ff", "#ffffff"]);

/** contact feel presets, light to heaviest; moves tune their own when these do not fit */
export const FEEL = {
  tap: { stop: 0.04, shake: [0.06, 1], pitch: 1.3 },
  light: { stop: 0.06, shake: [0.1, 1.2], pitch: 1.1 },
  firm: { stop: 0.08, shake: [0.12, 1.6], pitch: 0.95 },
  heavy: { stop: 0.12, shake: [0.2, 2.5], pitch: 0.8 },
  crush: { stop: 0.16, shake: [0.26, 3.2], pitch: 0.65 },
} as const satisfies Record<string, HitFeel>;

/** a heavy blow drives a foe within this many pixels of the stage edge back off the wall and up */
export const WALL_BOUNCE = { near: 24, launch: -230, back: 90 } as const;
