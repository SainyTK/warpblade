import { CRASH_REACH } from "../../../constants/jory/mallets";
import type { SlashShape } from "../../../types/effect";
import type { MalletBlow } from "../../../types/jory";
import { createCrashArcs } from "../../effects/jory/crashArcs";
import { createSlash } from "../../effects/slash";
import { game, hero } from "../../state";
import { skin } from "../skin";
import { tier } from "./beat";

/** each blow's smear on its hit frame, facing right, from his feet: the mallet head's path as it comes down */
const SMEARS: Readonly<Record<MalletBlow, Omit<SlashShape, "ramp">>> = {
  tap: { cx: 4, cy: -20, R: 13, sy: 0.85, rot: 0, a0: -1.3, a1: 0.45, W: 2, sweep: 0.03, trail: 0.08 },
  roll: { cx: 4, cy: -19, R: 11, sy: 0.7, rot: 0, a0: -1.0, a1: 0.5, W: 2, sweep: 0.02, trail: 0.06 },
  crash: { cx: 2, cy: -22, R: 16, sy: 1, rot: 0, a0: -2.0, a1: 0.9, W: 3, sweep: 0.05, trail: 0.14 },
  kick: { cx: 0, cy: -10, R: 14, sy: 0.6, rot: 0, a0: 1.3, a1: -0.4, W: 3, sweep: 0.05, trail: 0.12 },
  downstroke: { cx: 2, cy: -14, R: 14, sy: 0.9, rot: 0, a0: -1.6, a1: 1.3, W: 3, sweep: 0.05, trail: 0.12 },
};

/** the far mallet of Roll comes down from the other shoulder */
const FAR_ROLL: Omit<SlashShape, "ramp"> = { ...SMEARS.roll, cx: 1, cy: -18, a0: -1.2 };

/**
 * The blow's smear in his cobalt, brighter on an Accent; Roll's hits alternate the near and far mallet, and Crash
 * sends three arcs out of the drum along its cone
 */
export function smear(blow: MalletBlow, hit: number, accent: boolean): void {
  const shape = blow === "roll" && hit % 2 === 1 ? FAR_ROLL : SMEARS[blow];
  const ramp = accent ? skin.ramp : skin.ramp.slice(0, -1);
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...shape, ramp }));
  if (blow === "crash")
    game.fx.push(createCrashArcs(hero.x + hero.face * 8, hero.y - 12, hero.face, CRASH_REACH[tier() - 1]));
}
