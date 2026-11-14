import { frame } from "../../../constants/hero";
import type { Box } from "../../../types/world";

/** Cerise's guard: a weak block that lets nearly half through and costs a lot of stamina */
export const CERISE_BLOCK = { chip: 0.45, cost: 20 } as const;

/**
 * The riposte chain a parry opens: each link is a thrust that is a sure crit, `power` plus `step` for each link before it,
 * struck on `at` into its clip; J within `beat` seconds after a link lands is the next link, which starts `cancel` after
 * the strike; `links` at most.
 */
export const RIPOSTE = {
  power: 1.3,
  step: 0.25,
  at: frame(2),
  beat: 0.22,
  cancel: 0.05,
  links: 6,
  box: [-2, -32, 48, -6] as Box,
  stagger: 0.6,
} as const;
