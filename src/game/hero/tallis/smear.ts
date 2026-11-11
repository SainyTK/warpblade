import type { SlashShape } from "../../../types/effect";
import type { KnifeBlow } from "../../../types/tallis";
import { createSlash } from "../../effects/slash";
import { game, hero } from "../../state";
import { skin } from "../skin";

/** each blow's rose smear on its hit frame, facing right, from his feet */
const SMEARS: Partial<Record<KnifeBlow, Omit<SlashShape, "ramp">>> = {
  flick: { cx: 6, cy: -15, R: 12, sy: 0.35, rot: 0, a0: -0.5, a1: 0.35, W: 2, sweep: 0.03, trail: 0.08 },
  cross: { cx: 8, cy: -15, R: 11, sy: 0.9, rot: 0.75, a0: -0.9, a1: 0.9, W: 2, sweep: 0.03, trail: 0.1 },
  heelKick: { cx: 1, cy: -14, R: 16, sy: 1, rot: 0, a0: 0.7, a1: -2, W: 3, sweep: 0.06, trail: 0.16 },
  risingCut: { cx: 6, cy: -14, R: 15, sy: 1, rot: 0, a0: 1.2, a1: -1.5, W: 3, sweep: 0.05, trail: 0.14 },
  hamstring: { cx: 4, cy: -4, R: 22, sy: 0.25, rot: 0, a0: -0.8, a1: 0.7, W: 2, sweep: 0.05, trail: 0.12 },
};

/** the blow's smear, in his gloam ramp; the cross leaves an X of two */
export function smear(blow: KnifeBlow): void {
  const shape = SMEARS[blow];
  if (!shape) return;
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...shape, ramp: skin.ramp }));
  if (blow === "cross") game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...shape, rot: -0.75, ramp: skin.ramp }));
}
