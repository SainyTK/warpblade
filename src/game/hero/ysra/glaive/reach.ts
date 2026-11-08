import type { MoveHit } from "../../../../types/move";
import type { Box } from "../../../../types/world";
import { skillValues } from "../../../skills/query";
import { blowBonus, buffs } from "../buffs";

/** Deep Heft: how many pixels further every glaive blow reaches; Overheat's tongue of flame while it burns */
export const haftReach = (): number => (skillValues("y_heft").reach ?? 0) + buffs.reach;

/** a box pushed out at its far end: forward for a blow ahead, backward for a blow behind */
export function longer(box: Box, extra: number): Box {
  const [x0, y0, x1, y1] = box;
  if (x1 <= 0) return [x0 - extra, y0, x1, y1];
  return [x0, y0, x1 + extra, y1];
}

/** a blow's numbers a skill sets: its power, and pixels it reaches beyond her reach */
export interface GlaiveTune {
  power?: () => number;
  reach?: () => number;
  /** always a critical hit */
  crit?: () => boolean;
  /** a precise blow: the power every foe past the payoff's takes (docs/skill-design.md) */
  plain?: () => number;
}

/**
 * A glaive blow whose box and slash grow with her reach, and whose power carries her blow bonuses (Riposte, the
 * Eternal Hearth glow, a full bar), read at the moment the blow lands. A skill may set its power and extra reach.
 */
export function glaiveHit(hit: MoveHit, tune: GlaiveTune = {}): MoveHit {
  const power = tune.power ?? (() => hit.power);
  const reach = () => haftReach() + (tune.reach?.() ?? 0);
  return {
    ...hit,
    get box() {
      return longer(hit.box, reach());
    },
    get slash() {
      return hit.slash && { ...hit.slash, R: hit.slash.R + reach() };
    },
    get power() {
      return power() * (1 + blowBonus());
    },
    get plain() {
      return tune.plain && tune.plain() * (1 + blowBonus());
    },
    get crit() {
      return !!hit.crit || !!tune.crit?.() || buffs.crits > 0;
    },
  };
}
