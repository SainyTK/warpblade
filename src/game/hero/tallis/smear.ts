import type { SlashShape } from "../../../types/effect";
import type { KnifeBlow } from "../../../types/tallis";
import { createSlash } from "../../effects/slash";
import { game, hero } from "../../state";
import { skin } from "../skin";

/** each blow's rose smear on its hit frame, facing right, from his feet */
const SMEARS: Partial<Record<KnifeBlow, Omit<SlashShape, "ramp">>> = {
  flick: { cx: 6, cy: -15, R: 12, sy: 0.35, rot: 0, a0: -0.5, a1: 0.35, W: 2, sweep: 0.03, trail: 0.08 },
  cross: { cx: 8, cy: -15, R: 11, sy: 0.9, rot: 0.75, a0: -0.9, a1: 0.9, W: 2, sweep: 0.03, trail: 0.1 },
  heelKick: { cx: 4, cy: -12, R: 14, sy: 0.5, rot: 0, a0: -2.4, a1: 0.4, W: 3, sweep: 0.05, trail: 0.12 },
  backstab: { cx: 10, cy: -18, R: 9, sy: 1, rot: 0, a0: -1.6, a1: 0.5, W: 2, sweep: 0.03, trail: 0.1 },
  twist: { cx: 12, cy: -15, R: 5, sy: 1, rot: 0, a0: -Math.PI, a1: Math.PI * 0.9, W: 1.5, sweep: 0.04, trail: 0.08 },
  gutSlash: { cx: 4, cy: -12, R: 16, sy: 0.45, rot: 0, a0: -0.4, a1: 1.6, W: 3, sweep: 0.05, trail: 0.14 },
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
